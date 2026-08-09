import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const database_name = "little_lemon.db";
const database_version = "1.0";
const database_displayname = "Little Lemon SQLite Database";
const database_size = 200000;

let db;

export const getDBConnection = async () => {
  if (db) {
    return db;
  }
  db = await SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size
  );
  return db;
};

export const createTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL
  );`;

  await db.executeSql(query);
};

export const getMenuItems = async (db) => {
  try {
    const menuItems = [];
    const results = await db.executeSql(`SELECT * FROM menu`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        menuItems.push(result.rows.item(index));
      }
    });
    return menuItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get menuItems !!!');
  }
};

export const saveMenuItems = async (db, menuItems) => {
  try {
    const insertQuery =
      `INSERT INTO menu (name, price, description, image, category) values ` +
      menuItems.map(i => `('${i.name.replace(/'/g, "''")}', ${i.price}, '${i.description.replace(/'/g, "''")}', '${i.image.replace(/'/g, "''")}', '${i.category.replace(/'/g, "''")}')`).join(',');
    
    await db.executeSql(insertQuery);
  } catch (error) {
    console.error(error);
    throw Error('Failed to save menuItems !!!');
  }
};

export const filterByQueryAndCategories = async (db, query, activeCategories) => {
  try {
    const menuItems = [];
    let sqlQuery = `SELECT * FROM menu`;
    
    const hasQuery = query.length > 0;
    const hasCategories = activeCategories.length > 0;
    
    if (hasQuery || hasCategories) {
      sqlQuery += ` WHERE`;
      
      if (hasQuery) {
        sqlQuery += ` name LIKE '%${query.replace(/'/g, "''")}%'`;
      }
      
      if (hasQuery && hasCategories) {
        sqlQuery += ` AND`;
      }
      
      if (hasCategories) {
        const categoryList = activeCategories.map(c => `'${c.replace(/'/g, "''")}'`).join(',');
        sqlQuery += ` category IN (${categoryList})`;
      }
    }
    
    const results = await db.executeSql(sqlQuery);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        menuItems.push(result.rows.item(index));
      }
    });
    return menuItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to filter menuItems !!!');
  }
};
