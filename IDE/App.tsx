import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, TextInput, Button, FlatList } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const db = openDatabase({
  name: "rn_sqlite",
});

const App = () => {
  const [category, setCategory] = useState("");
  const [delcategory, setDelCategory] = useState("");
  const [updateid, updateIdCategory] = useState("");
  const [updatename, updateNameCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const createTables = async () => {
    (await db).transaction(txn => {
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))`,
        [],
        (sqlTxn, res) => {
          console.log('table created successfully');
        },
        error => {
          console.log('error on creating table ' + error);
        },
      );
    });
  };

  const addCategory = async () => {
    if (!category) {
      alert("Enter category");
      return false;
    }
    (await db).transaction(txn => {
      txn.executeSql(
        `INSERT INTO categories(name) VALUES(?)`,
        [category],
        (sqlTxn, res) => {
          // (SQLTransaction, SQLResultSet)
          console.log(`${category} category added successfully`);
          getCategories();
          setCategory("");
        },
        error => {
          console.log('error on adding category' + error);
        },
      )
    });
  };

  const getCategories = async () => {
    (await db).transaction(txn => {
      txn.executeSql(
        `SELECT * FROM categories ORDER BY id DESC`,
        [],
        (sqlTxn, res) => {
          console.log('categories retrieved successfully');
          let len = res.rows.length;
          if (len > 0) {
            let results = [];
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i);
              results.push({ id: item.id, name: item.name })
            }
            setCategories(results);
          }
        },
        error => {
          console.log('error on getting categories ' + error);
        }
      )
    });
  };

  const renderCategory = ({ item }) => {
    return (
      <View style={{
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: "#ddd"
      }}>
        <Text style={{ marginRight: 9 }}>{item.id}</Text>
        <Text>{item.name}</Text>
      </View>
    );
  };
  const delCategory = async () => {

    if (!delcategory) {
      alert("Enter Id");
      return false;
    }
    (await db).transaction(txn => {
      txn.executeSql(
        `DELETE FROM categories WHERE id = ?`,
        [delcategory],
        (sqlTxn, res) => {
          // (SQLTransaction, SQLResultSet)
          console.log(`${delcategory} category deleted successfully`);
          getCategories();
          setDelCategory("");
        },
        error => {
          console.log('error on deleting category' + error);
        },
      )
    });
  };
  const updateCategory = async () => {
    if (!updateid) {
      alert("Enter Id");
      return false;
    }
    if (!updatename) {
      alert("Enter Name");
      return false;
    }
    (await db).transaction(txn => {
      txn.executeSql(
        `UPDATE categories SET name = ? WHERE id = ?`,
        [updatename, updateid],
        (sqlTxn, res) => {
          // (SQLTransaction, SQLResultSet)
          console.log(`id ${updateid} category Updated successfully`);
          getCategories();
          updateIdCategory("");
          updateNameCategory("");

        },
        error => {
          console.log('error on updating category' + error);
        },
      )
    });
  };
  useEffect(() => {
    createTables();
    getCategories();
  }, [])

  return (
    <View>
      <StatusBar backgroundColor="orange" />
      <TextInput
        placeholder='Enter category'
        value={category}
        onChangeText={setCategory}
        style={{ marginHorizontal: 8 }}
      />
      <Button title="INSERT" onPress={addCategory} />
      <TextInput
        placeholder='Enter Id'
        value={delcategory}
        onChangeText={setDelCategory}
        style={{ marginHorizontal: 8 }}
      />
      <Button title="DELETE" onPress={delCategory} />
      <TextInput
        placeholder='Enter Id'
        value={updateid}
        onChangeText={updateIdCategory}
        style={{ marginHorizontal: 8 }}
      />
      <TextInput
        placeholder='Enter Name'
        value={updatename}
        onChangeText={updateNameCategory}
        style={{ marginHorizontal: 8 }}
      />
      <Button title="UPDATE" onPress={updateCategory} />


      <FlatList
        data={categories}
        renderItem={renderCategory}
        key={cat => cat.id}
      />
    </View>
  );
};

export default App;
