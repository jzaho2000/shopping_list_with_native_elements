import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import {Header, Input, Button, ListItem, Icon} from 'react-native-elements';




export default function App() {

  const[product, setProduct] = React.useState('');
  const[amount, setAmount] = React.useState('');
  const[shoppinglist, setShoppinglist] = React.useState([]);
  const db = SQLite.openDatabase('shoppinglist.db');

  //console.log("Käynnistys...");

  renderItem = ({ item}) => (
    <ListItem bottomDivider>
      <ListItem.Content style={styles.listContentComponent}>
        <View style={styles.listContent}> 
          <ListItem.Title>{item.product}</ListItem.Title>
          <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        </View>
        <View style={styles.listButton} >
          <Icon name="delete" color="red"  onPress={() => deleteProduct(item.id)} />
        </View>
      </ListItem.Content>
      
    </ListItem>
  );
 
  useEffect( () => {
  
    db.transaction(
      tx => {
        tx.executeSql('create table if not exists shoppinglist(id  integer primary key not null, product text not null, amount text);');
      }, 
      showError, 
      updateList
    );
    
  }, []);


  // Kehitysvaiheen funktio, joka kertoo tietokantakyselyissä tapahtuneet virheet
  const showError = (error) => {
    //console.log(error.message);
  }





  const updateList = () =>  {
    db.transaction( 
      tx => {
          tx.executeSql('select id, product, amount from shoppinglist;', [], (tx, {rows})  => {setShoppinglist(rows._array); 
                                                                                              //console.log(JSON.stringify(shoppinglist));
                                                                                            } );
          
      }, 
      showError, 
      null
    );
  }


  const saveProduct = () => {

    if (product == null || product.trim() == '' )
      return;

    if (amount != null && amount.trim() == '')
      setAmount(null);

    db.transaction(
      tx => {
          tx.executeSql('insert into shoppinglist (product, amount) values (?, ?);',
                        [product, amount]);
          setProduct('');
          setAmount('');
      },
      showError,
      updateList
    );

  }

  const deleteProduct = (id) => {

    db.transaction(
      tx => {
          tx.executeSql('delete from shoppinglist where id = ?', [id]);
      },
      showError,
      updateList
    );

  }



  
  
  




  return (
    <View style={styles.container}>
      <Header
        centerComponent={{text:"SHOPPING LIST", style: styles.header_component_center}}
      />
      
      
      <View style={styles.container2}>
        <Input placeholder="Product" label="PRODUCT" style={styles.nfield} onChangeText={product => setProduct(product)} value={product} />
        <Input placeholder="Amount"  label="AMOUNT"  style={styles.nfield} onChangeText={amount => setAmount(amount)} value={amount} />

        <Button raised icon={{name: 'save', color: "white"}} style={styles.buttonStyle} title="SAVE" onPress={() => saveProduct()} />
      </View>
    
      
      <FlatList
        style={styles.listStyle}
        data={shoppinglist}
        renderItem={renderItem}
        keyExtractor ={(item, index) => index.toString()}
        
      
      />
     

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
    width: '100%',
    marginTop: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  header_component_center: {
    color: 'white',
    marginBottom: 5
  },
  header: {
    fontWeight: 'bold',
    //color: 'blue',
    fontSize: 17
  }, 
  nfield: {
    width: '70%',
    marginBottom: 5,
    marginTop: 5,
    padding: 5 
    //borderColor: 'gray', 
    //borderWidth: 1,
    //marginTop: 0,
    //marginBottom: 10
  },
 
  listStyle: {
    //flex: 1,
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5
  }, 
  listContentComponent : {
    flexDirection: 'row'
  },
  listContent : {
    width: '80%'
  },
  listButton : {
    flexDirection: 'row',
    width: '20%',
    alignItems: 'center'
  },
});
