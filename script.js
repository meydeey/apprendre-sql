// ============================================
// APPRENDRE SQL & PostgreSQL — LE LABO IA
// Interactive Learning Platform
// ============================================

let db = null;
let currentSectionIndex = 0;
let completedSections = new Set();
let schemaOpen = true;

// ============================================
// Database Setup
// ============================================
const SAMPLE_DATA = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT '2024-01-15'
);

INSERT INTO users VALUES (1, 'Alice Martin', 'alice@email.com', 'admin', '2024-01-10');
INSERT INTO users VALUES (2, 'Bob Dupont', 'bob@email.com', 'user', '2024-01-15');
INSERT INTO users VALUES (3, 'Charlie Durand', 'charlie@email.com', 'user', '2024-02-01');
INSERT INTO users VALUES (4, 'Diana Petit', 'diana@email.com', 'moderator', '2024-02-10');
INSERT INTO users VALUES (5, 'Eve Bernard', 'eve@email.com', 'user', '2024-03-01');
INSERT INTO users VALUES (6, 'Frank Moreau', 'frank@email.com', 'user', '2024-03-15');
INSERT INTO users VALUES (7, 'Grace Thomas', 'grace@email.com', 'user', '2024-04-01');
INSERT INTO users VALUES (8, 'Hugo Robert', 'hugo@email.com', 'admin', '2024-04-20');
INSERT INTO users VALUES (9, 'Iris Leroy', 'iris@email.com', 'user', '2024-05-05');
INSERT INTO users VALUES (10, 'Jules Simon', 'jules@email.com', 'user', '2024-05-20');

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  created_at TEXT DEFAULT '2024-01-10'
);

INSERT INTO products VALUES (1, 'MacBook Pro', 2499.99, 'Informatique', 15, '2024-01-05');
INSERT INTO products VALUES (2, 'iPhone 15', 999.99, 'Telephone', 50, '2024-01-05');
INSERT INTO products VALUES (3, 'AirPods Pro', 279.99, 'Audio', 100, '2024-01-10');
INSERT INTO products VALUES (4, 'iPad Air', 699.99, 'Informatique', 30, '2024-01-15');
INSERT INTO products VALUES (5, 'Clavier MX Keys', 119.99, 'Accessoire', 80, '2024-02-01');
INSERT INTO products VALUES (6, 'Souris MX Master', 99.99, 'Accessoire', 65, '2024-02-01');
INSERT INTO products VALUES (7, 'Ecran 4K 27"', 449.99, 'Informatique', 20, '2024-02-15');
INSERT INTO products VALUES (8, 'Casque Sony WH', 349.99, 'Audio', 40, '2024-03-01');
INSERT INTO products VALUES (9, 'Webcam HD', 79.99, 'Accessoire', 90, '2024-03-10');
INSERT INTO products VALUES (10, 'Samsung Galaxy S24', 899.99, 'Telephone', 35, '2024-03-15');
INSERT INTO products VALUES (11, 'Enceinte Bluetooth', 59.99, 'Audio', 120, '2024-04-01');
INSERT INTO products VALUES (12, 'Hub USB-C', 49.99, 'Accessoire', 150, '2024-04-10');

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT '2024-02-01',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO orders VALUES (1, 1, 1, 1, 2499.99, 'delivered', '2024-02-01');
INSERT INTO orders VALUES (2, 2, 2, 1, 999.99, 'delivered', '2024-02-05');
INSERT INTO orders VALUES (3, 1, 3, 2, 559.98, 'delivered', '2024-02-10');
INSERT INTO orders VALUES (4, 3, 5, 1, 119.99, 'delivered', '2024-02-15');
INSERT INTO orders VALUES (5, 4, 7, 1, 449.99, 'shipped', '2024-02-20');
INSERT INTO orders VALUES (6, 2, 6, 1, 99.99, 'delivered', '2024-03-01');
INSERT INTO orders VALUES (7, 5, 2, 1, 999.99, 'shipped', '2024-03-05');
INSERT INTO orders VALUES (8, 1, 8, 1, 349.99, 'delivered', '2024-03-10');
INSERT INTO orders VALUES (9, 6, 4, 1, 699.99, 'pending', '2024-03-15');
INSERT INTO orders VALUES (10, 3, 11, 3, 179.97, 'delivered', '2024-03-20');
INSERT INTO orders VALUES (11, 7, 9, 2, 159.98, 'shipped', '2024-04-01');
INSERT INTO orders VALUES (12, 8, 1, 1, 2499.99, 'pending', '2024-04-05');
INSERT INTO orders VALUES (13, 2, 12, 4, 199.96, 'delivered', '2024-04-10');
INSERT INTO orders VALUES (14, 9, 10, 1, 899.99, 'shipped', '2024-04-15');
INSERT INTO orders VALUES (15, 4, 3, 1, 279.99, 'delivered', '2024-04-20');
INSERT INTO orders VALUES (16, 10, 5, 2, 239.98, 'pending', '2024-05-01');
INSERT INTO orders VALUES (17, 5, 8, 1, 349.99, 'delivered', '2024-05-05');
INSERT INTO orders VALUES (18, 3, 2, 1, 999.99, 'cancelled', '2024-05-10');
INSERT INTO orders VALUES (19, 1, 12, 2, 99.98, 'delivered', '2024-05-15');
INSERT INTO orders VALUES (20, 6, 10, 1, 899.99, 'shipped', '2024-05-20');

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT DEFAULT '2024-03-01',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO reviews VALUES (1, 1, 1, 5, 'Excellent laptop, tres performant !', '2024-02-15');
INSERT INTO reviews VALUES (2, 2, 2, 4, 'Bon telephone, camera superbe', '2024-02-20');
INSERT INTO reviews VALUES (3, 1, 3, 5, 'Son incroyable, reduction de bruit top', '2024-02-25');
INSERT INTO reviews VALUES (4, 3, 5, 4, 'Clavier confortable pour coder', '2024-03-01');
INSERT INTO reviews VALUES (5, 4, 7, 3, 'Bon ecran mais un peu cher', '2024-03-05');
INSERT INTO reviews VALUES (6, 2, 6, 5, 'La meilleure souris du marche', '2024-03-15');
INSERT INTO reviews VALUES (7, 5, 2, 4, 'Tres satisfaite, livraison rapide', '2024-03-20');
INSERT INTO reviews VALUES (8, 1, 8, 4, 'Super casque, autonomie correcte', '2024-03-25');
INSERT INTO reviews VALUES (9, 3, 11, 3, 'Son correct pour le prix', '2024-04-01');
INSERT INTO reviews VALUES (10, 6, 4, 5, 'Parfait pour dessiner et lire', '2024-04-10');
INSERT INTO reviews VALUES (11, 7, 9, 2, 'Qualite video moyenne', '2024-04-15');
INSERT INTO reviews VALUES (12, 8, 1, 5, 'Deuxieme achat, toujours au top', '2024-04-20');
INSERT INTO reviews VALUES (13, 9, 10, 4, 'Excellent smartphone Android', '2024-04-25');
INSERT INTO reviews VALUES (14, 2, 12, 4, 'Pratique, bon rapport qualite prix', '2024-05-01');
INSERT INTO reviews VALUES (15, 10, 5, 5, 'Parfait pour le teletravail', '2024-05-10');
`;

async function initDatabase() {
  const SQL = await initSqlJs({
    locateFile: (file) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`,
  });
  db = new SQL.Database();
  populateDatabase();
}

function populateDatabase() {
  db.run(SAMPLE_DATA);
}

function resetDatabase() {
  db.run("DROP TABLE IF EXISTS reviews");
  db.run("DROP TABLE IF EXISTS orders");
  db.run("DROP TABLE IF EXISTS products");
  db.run("DROP TABLE IF EXISTS users");
  populateDatabase();
}

function getSchema() {
  const tables = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  );
  if (!tables.length) return [];

  return tables[0].values.map(([tableName]) => {
    const cols = db.exec(`PRAGMA table_info('${tableName}')`);
    return {
      name: tableName,
      columns: cols[0].values.map((row) => ({
        name: row[1],
        type: row[2] || "TEXT",
        notnull: row[3] === 1,
        pk: row[5] === 1,
      })),
    };
  });
}

function executeQuery(sql) {
  try {
    const trimmed = sql.trim();
    if (!trimmed)
      return {
        type: "error",
        error: "Ecris une requete SQL avant de cliquer sur Executer.",
      };

    const isSelect = /^\s*(SELECT|PRAGMA|EXPLAIN)/i.test(trimmed);

    if (isSelect) {
      const results = db.exec(trimmed);
      if (results.length === 0) {
        return {
          type: "select",
          columns: [],
          values: [],
          message: "Requete executee. Aucun resultat.",
        };
      }
      const last = results[results.length - 1];
      return { type: "select", columns: last.columns, values: last.values };
    } else {
      db.run(trimmed);
      const changes = db.getRowsModified();
      let queryType = "executee";
      if (/^\s*INSERT/i.test(trimmed)) queryType = "inseree(s)";
      else if (/^\s*UPDATE/i.test(trimmed)) queryType = "modifiee(s)";
      else if (/^\s*DELETE/i.test(trimmed)) queryType = "supprimee(s)";
      else if (/^\s*(CREATE|ALTER|DROP)/i.test(trimmed))
        queryType = "structure modifiee";

      return { type: "mutation", changes, queryType };
    }
  } catch (e) {
    return { type: "error", error: e.message };
  }
}

// ============================================
// Sections
// ============================================
const SECTIONS = [
  {
    id: "welcome",
    title: "Bienvenue",
    category: "intro",
    isWelcome: true,
  },
  {
    id: "cest-quoi-sql",
    title: "C'est quoi SQL ?",
    category: "intro",
    description:
      "SQL (Structured Query Language) est le langage universel pour parler aux bases de donnees. Quand tu utilises Supabase, chaque requete que tu fais passe par du SQL sous le capot. Comprendre SQL, c'est comprendre ce qui se passe vraiment dans ta base.",
    tips: [
      "SQL se prononce 'S-Q-L' ou 'sequel'",
      "Une <code>base de donnees</code> stocke des informations dans des <code>tables</code>",
      "Une <code>table</code> = un tableau avec des <code>colonnes</code> (champs) et des <code>lignes</code> (enregistrements)",
      "SQL permet de <code>lire</code>, <code>ajouter</code>, <code>modifier</code> et <code>supprimer</code> des donnees",
    ],
    sql: "SELECT 'Hello SQL !' AS message, 1 + 1 AS calcul, 42 AS la_reponse;",
  },
  {
    id: "select-basics",
    title: "SELECT : Ta premiere requete",
    category: "select",
    description:
      "<code>SELECT</code> est LA commande pour lire des donnees. Tu lui dis quelles colonnes tu veux, et <code>FROM</code> indique dans quelle table chercher. <code>SELECT *</code> veut dire 'toutes les colonnes'.",
    tips: [
      "<code>SELECT *</code> : toutes les colonnes",
      "<code>SELECT colonne1, colonne2</code> : colonnes specifiques",
      "<code>FROM table</code> : dans quelle table chercher",
      "<code>AS alias</code> : renommer une colonne dans le resultat",
    ],
    sql: "-- Toutes les colonnes de la table users\nSELECT * FROM users;\n\n-- Essaie aussi :\n-- SELECT name, email FROM users;\n-- SELECT name AS prenom, email AS courriel FROM users;",
  },
  {
    id: "where",
    title: "WHERE : Filtrer les resultats",
    category: "select",
    description:
      "<code>WHERE</code> filtre les lignes selon une condition. C'est comme dire 'donne-moi SEULEMENT les lignes ou...' Tu peux comparer avec <code>=</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.",
    tips: [
      "<code>WHERE colonne = 'valeur'</code> : egal a",
      "<code>WHERE colonne != 'valeur'</code> : different de",
      "<code>WHERE colonne > 100</code> : plus grand que",
      "<code>WHERE colonne <= 50</code> : plus petit ou egal",
      "Les textes sont entre guillemets simples : <code>'valeur'</code>",
    ],
    sql: "-- Les utilisateurs qui sont admins\nSELECT * FROM users WHERE role = 'admin';\n\n-- Essaie aussi :\n-- SELECT * FROM products WHERE price > 500;\n-- SELECT name, price FROM products WHERE stock < 30;",
  },
  {
    id: "and-or-in-like",
    title: "AND, OR, IN, BETWEEN, LIKE",
    category: "select",
    description:
      "Tu peux combiner plusieurs conditions avec <code>AND</code> (et) et <code>OR</code> (ou). <code>IN</code> verifie si une valeur est dans une liste, <code>BETWEEN</code> verifie un intervalle, et <code>LIKE</code> cherche un motif dans du texte.",
    tips: [
      "<code>AND</code> : les deux conditions doivent etre vraies",
      "<code>OR</code> : au moins une condition doit etre vraie",
      "<code>IN ('a', 'b', 'c')</code> : la valeur est dans la liste",
      "<code>BETWEEN 10 AND 100</code> : entre 10 et 100 (inclus)",
      "<code>LIKE '%texte%'</code> : contient 'texte' (<code>%</code> = n'importe quoi)",
      "<code>LIKE 'A%'</code> : commence par 'A'",
    ],
    sql: "-- Produits entre 100 et 500 euros\nSELECT name, price, category\nFROM products\nWHERE price BETWEEN 100 AND 500;\n\n-- Essaie aussi :\n-- SELECT * FROM products WHERE category IN ('Audio', 'Telephone');\n-- SELECT * FROM users WHERE name LIKE '%Martin%';\n-- SELECT * FROM products WHERE price > 200 AND category = 'Informatique';",
  },
  {
    id: "order-limit",
    title: "ORDER BY, LIMIT, OFFSET",
    category: "select",
    description:
      "<code>ORDER BY</code> trie les resultats. <code>LIMIT</code> limite le nombre de lignes retournees. <code>OFFSET</code> saute les X premieres lignes. C'est essentiel pour la pagination dans Supabase !",
    tips: [
      "<code>ORDER BY colonne ASC</code> : tri croissant (par defaut)",
      "<code>ORDER BY colonne DESC</code> : tri decroissant",
      "<code>LIMIT 5</code> : retourne seulement 5 lignes",
      "<code>OFFSET 10</code> : saute les 10 premieres lignes",
      "Combine LIMIT + OFFSET pour la pagination",
    ],
    sql: "-- Les 5 produits les plus chers\nSELECT name, price, category\nFROM products\nORDER BY price DESC\nLIMIT 5;\n\n-- Essaie aussi : pagination (page 2, 3 elements par page)\n-- SELECT name, price FROM products ORDER BY price DESC LIMIT 3 OFFSET 3;",
  },
  {
    id: "aggregation",
    title: "COUNT, SUM, AVG, MIN, MAX",
    category: "aggregation",
    description:
      "Les fonctions d'agregation calculent une valeur a partir de plusieurs lignes. <code>COUNT</code> compte, <code>SUM</code> additionne, <code>AVG</code> fait la moyenne, <code>MIN</code> et <code>MAX</code> trouvent les extremes.",
    tips: [
      "<code>COUNT(*)</code> : nombre total de lignes",
      "<code>COUNT(colonne)</code> : nombre de valeurs non-NULL",
      "<code>SUM(colonne)</code> : somme des valeurs",
      "<code>AVG(colonne)</code> : moyenne des valeurs",
      "<code>MIN(colonne)</code> / <code>MAX(colonne)</code> : valeur min / max",
      "<code>ROUND(valeur, 2)</code> : arrondir a 2 decimales",
    ],
    sql: "-- Statistiques sur les produits\nSELECT\n  COUNT(*) AS nombre_produits,\n  ROUND(AVG(price), 2) AS prix_moyen,\n  MIN(price) AS prix_min,\n  MAX(price) AS prix_max,\n  SUM(stock) AS stock_total\nFROM products;\n\n-- Essaie aussi :\n-- SELECT COUNT(*) AS total_commandes, SUM(total) AS revenu_total FROM orders WHERE status = 'delivered';",
  },
  {
    id: "group-by",
    title: "GROUP BY & HAVING",
    category: "aggregation",
    description:
      "<code>GROUP BY</code> regroupe les lignes par valeur commune, puis applique les fonctions d'agregation sur chaque groupe. <code>HAVING</code> filtre les groupes (comme <code>WHERE</code> mais APRES le regroupement).",
    tips: [
      "<code>GROUP BY colonne</code> : regrouper par valeur",
      "Chaque colonne dans le SELECT doit etre dans GROUP BY ou dans une fonction d'agregation",
      "<code>HAVING</code> : filtre les groupes (apres GROUP BY)",
      "<code>WHERE</code> filtre AVANT le regroupement, <code>HAVING</code> filtre APRES",
    ],
    sql: "-- Nombre de produits et prix moyen par categorie\nSELECT\n  category,\n  COUNT(*) AS nb_produits,\n  ROUND(AVG(price), 2) AS prix_moyen\nFROM products\nGROUP BY category\nORDER BY prix_moyen DESC;\n\n-- Essaie HAVING :\n-- SELECT category, COUNT(*) AS nb FROM products GROUP BY category HAVING nb > 2;",
  },
  {
    id: "insert",
    title: "INSERT INTO",
    category: "modification",
    description:
      "<code>INSERT INTO</code> ajoute de nouvelles lignes dans une table. Tu specifies la table, les colonnes, et les valeurs. Apres un INSERT, tu peux faire un SELECT pour verifier que la ligne a ete ajoutee.",
    tips: [
      "<code>INSERT INTO table (col1, col2) VALUES (val1, val2)</code>",
      "Les textes entre guillemets simples : <code>'valeur'</code>",
      "Les nombres sans guillemets : <code>42</code>",
      "Tu peux inserer plusieurs lignes d'un coup avec plusieurs <code>VALUES</code>",
      "Utilise le bouton 'Reset DB' si tu veux repartir a zero",
    ],
    sql: "-- Ajouter un nouvel utilisateur\nINSERT INTO users (id, name, email, role, created_at)\nVALUES (11, 'Sophie Duval', 'sophie@email.com', 'user', '2024-06-01');\n\n-- Verifie que ca a marche :\n-- SELECT * FROM users WHERE id = 11;",
  },
  {
    id: "update-delete",
    title: "UPDATE & DELETE",
    category: "modification",
    description:
      "<code>UPDATE</code> modifie des lignes existantes. <code>DELETE</code> les supprime. ATTENTION : sans <code>WHERE</code>, ces commandes affectent TOUTES les lignes ! C'est la source du bug #1 en production.",
    tips: [
      "<code>UPDATE table SET col = val WHERE condition</code>",
      "<code>DELETE FROM table WHERE condition</code>",
      "TOUJOURS mettre un <code>WHERE</code> sinon tu modifies/supprimes TOUT",
      "Astuce : fais d'abord un <code>SELECT</code> avec le meme <code>WHERE</code> pour verifier",
      "Dans Supabase, les RLS policies protegent contre les erreurs",
    ],
    sql: "-- Modifier le role d'un utilisateur\nUPDATE users SET role = 'moderator' WHERE id = 2;\n\n-- Verifie :\n-- SELECT * FROM users WHERE id = 2;\n\n-- Supprimer une commande annulee :\n-- DELETE FROM orders WHERE status = 'cancelled';\n-- SELECT * FROM orders;",
  },
  {
    id: "inner-join",
    title: "INNER JOIN",
    category: "jointures",
    description:
      "Un <code>JOIN</code> combine les lignes de 2 tables basees sur une relation. <code>INNER JOIN</code> retourne seulement les lignes qui ont une correspondance dans les deux tables. C'est le JOIN le plus utilise.",
    tips: [
      "<code>INNER JOIN table2 ON table1.col = table2.col</code>",
      "Le <code>ON</code> definit la condition de liaison",
      "Utilise des alias pour simplifier : <code>FROM users u</code>",
      "INNER JOIN = seulement les lignes qui matchent des deux cotes",
    ],
    sql: "-- Commandes avec le nom de l'utilisateur et du produit\nSELECT\n  o.id AS commande,\n  u.name AS client,\n  p.name AS produit,\n  o.quantity,\n  o.total,\n  o.status\nFROM orders o\nINNER JOIN users u ON o.user_id = u.id\nINNER JOIN products p ON o.product_id = p.id\nORDER BY o.id;",
  },
  {
    id: "left-right-join",
    title: "LEFT, RIGHT & FULL JOIN",
    category: "jointures",
    description:
      "<code>LEFT JOIN</code> retourne TOUTES les lignes de la table de gauche, meme sans correspondance. Les colonnes de droite seront <code>NULL</code>. <code>RIGHT JOIN</code> fait l'inverse. <code>FULL JOIN</code> retourne tout des deux cotes.",
    tips: [
      "<code>LEFT JOIN</code> : tout de la table de gauche + matchs de droite",
      "<code>RIGHT JOIN</code> : tout de la table de droite + matchs de gauche (non supporte en SQLite)",
      "<code>FULL JOIN</code> : tout des deux tables (non supporte en SQLite, mais supporte en PostgreSQL)",
      "Les valeurs sans correspondance deviennent <code>NULL</code>",
    ],
    sql: "-- Tous les utilisateurs, meme ceux sans commande\nSELECT\n  u.name AS client,\n  COUNT(o.id) AS nb_commandes,\n  COALESCE(SUM(o.total), 0) AS total_depense\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nORDER BY total_depense DESC;\n\n-- COALESCE remplace NULL par 0",
  },
  {
    id: "subqueries",
    title: "Sous-requetes",
    category: "jointures",
    description:
      "Une sous-requete est un <code>SELECT</code> a l'interieur d'un autre <code>SELECT</code>. Tu peux les utiliser dans <code>WHERE</code>, <code>FROM</code>, ou <code>SELECT</code>. C'est puissant pour les requetes complexes.",
    tips: [
      "Sous-requete dans <code>WHERE</code> : filtrer selon le resultat d'une autre requete",
      "Sous-requete dans <code>FROM</code> : utiliser un resultat comme table temporaire",
      "<code>IN (SELECT ...)</code> : verifier si une valeur est dans le resultat",
      "<code>EXISTS (SELECT ...)</code> : verifier si la sous-requete retourne des lignes",
    ],
    sql: "-- Produits qui n'ont jamais ete commandes\nSELECT name, price, category\nFROM products\nWHERE id NOT IN (\n  SELECT DISTINCT product_id FROM orders\n);\n\n-- Essaie aussi :\n-- Utilisateurs qui ont depense plus que la moyenne\n-- SELECT u.name, SUM(o.total) AS total\n-- FROM users u\n-- JOIN orders o ON u.id = o.user_id\n-- GROUP BY u.id, u.name\n-- HAVING total > (SELECT AVG(total) FROM orders);",
  },
  {
    id: "create-alter",
    title: "CREATE TABLE & ALTER TABLE",
    category: "structure",
    description:
      "Tu peux creer tes propres tables avec <code>CREATE TABLE</code> et les modifier avec <code>ALTER TABLE</code>. C'est ce que tu fais dans l'editeur SQL de Supabase quand tu definis ton schema.",
    tips: [
      "<code>CREATE TABLE nom (colonne TYPE, ...)</code>",
      "Types courants : <code>INTEGER</code>, <code>TEXT</code>, <code>REAL</code> (decimal)",
      "<code>PRIMARY KEY</code> : identifiant unique de la ligne",
      "<code>NOT NULL</code> : la colonne ne peut pas etre vide",
      "<code>DEFAULT valeur</code> : valeur par defaut",
      "<code>FOREIGN KEY</code> : reference vers une autre table",
      "<code>ALTER TABLE ... ADD COLUMN ...</code> : ajouter une colonne",
    ],
    sql: "-- Creer une table de categories\nCREATE TABLE categories (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  description TEXT,\n  color TEXT DEFAULT '#2563EB'\n);\n\n-- Essaie ensuite :\n-- INSERT INTO categories VALUES (1, 'Tech', 'Produits technologiques', '#3B82F6');\n-- SELECT * FROM categories;",
  },
  {
    id: "indexes",
    title: "Indexes & Performance",
    category: "structure",
    description:
      "Un <code>INDEX</code> accelere les recherches sur une colonne, comme l'index d'un livre. Sans index, la base doit lire TOUTES les lignes (scan complet). Avec un index, elle va directement au bon endroit.",
    tips: [
      "<code>CREATE INDEX nom ON table(colonne)</code> : creer un index",
      "Mets des index sur les colonnes utilisees dans <code>WHERE</code> et <code>JOIN</code>",
      "Les <code>PRIMARY KEY</code> ont deja un index automatique",
      "Trop d'index ralentissent les INSERT/UPDATE",
      "En PostgreSQL : <code>EXPLAIN ANALYZE</code> montre le plan d'execution",
    ],
    sql: "-- Creer un index sur la colonne email (recherche frequente)\nCREATE INDEX idx_users_email ON users(email);\n\n-- Creer un index sur les commandes par user_id (JOIN frequent)\nCREATE INDEX idx_orders_user ON orders(user_id);\n\n-- Voir les index existants\nSELECT * FROM sqlite_master WHERE type = 'index';",
  },
  {
    id: "views",
    title: "Views (Vues)",
    category: "structure",
    description:
      "Une <code>VIEW</code> est une requete sauvegardee que tu peux reutiliser comme une table. Dans Supabase, les views sont tres utiles pour exposer des donnees calculees via l'API sans dupliquer la logique.",
    tips: [
      "<code>CREATE VIEW nom AS SELECT ...</code> : creer une vue",
      "Utilise une vue comme une table : <code>SELECT * FROM ma_vue</code>",
      "Les vues ne stockent pas de donnees, elles executent la requete a chaque appel",
      "Dans Supabase, les vues sont accessibles via l'API REST automatiquement",
      "<code>DROP VIEW nom</code> : supprimer une vue",
    ],
    sql: "-- Vue : resume des ventes par client\nCREATE VIEW client_stats AS\nSELECT\n  u.id,\n  u.name,\n  u.email,\n  COUNT(o.id) AS nb_commandes,\n  COALESCE(SUM(o.total), 0) AS total_depense,\n  COALESCE(ROUND(AVG(o.total), 2), 0) AS panier_moyen\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name, u.email;\n\n-- Maintenant utilise-la comme une table :\n-- SELECT * FROM client_stats ORDER BY total_depense DESC;",
  },
  {
    id: "postgresql-supabase",
    title: "PostgreSQL & Supabase",
    category: "supabase",
    description:
      "Supabase utilise PostgreSQL, qui a des fonctionnalites que SQLite n'a pas. Cette lecon couvre les types et concepts specifiques a PostgreSQL que tu rencontreras dans Supabase.",
    isTheory: true,
    theoryBlocks: [
      {
        title: "Types PostgreSQL vs SQLite",
        content:
          "SQLite a 5 types (NULL, INTEGER, REAL, TEXT, BLOB). PostgreSQL en a beaucoup plus. Voici les plus utilises dans Supabase :",
        code: "-- PostgreSQL (Supabase)\nCREATE TABLE profiles (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  username TEXT UNIQUE NOT NULL,\n  bio TEXT,\n  age INTEGER,\n  salary NUMERIC(10, 2),\n  is_active BOOLEAN DEFAULT true,\n  tags TEXT[],             -- tableau de textes\n  metadata JSONB,          -- JSON binaire (performant)\n  avatar_url TEXT,\n  created_at TIMESTAMPTZ DEFAULT now(),\n  updated_at TIMESTAMPTZ DEFAULT now()\n);",
      },
      {
        title: "UUID vs ID auto-increment",
        content:
          "Dans Supabase, on utilise souvent des <code>UUID</code> (identifiants uniques universels) au lieu de nombres auto-incrementes. C'est plus securise car les IDs ne sont pas devinables.",
        code: "-- SQLite (ce qu'on utilise ici)\nid INTEGER PRIMARY KEY  -- 1, 2, 3, 4...\n\n-- PostgreSQL (Supabase)\nid UUID DEFAULT gen_random_uuid() PRIMARY KEY\n-- 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'",
      },
      {
        title: "JSONB : stocker du JSON",
        content:
          "PostgreSQL peut stocker et interroger du JSON directement. <code>JSONB</code> est le format optimise. Tu peux acceder aux champs avec <code>-></code> et <code>->></code>.",
        code: "-- Inserer du JSONB\nINSERT INTO profiles (metadata)\nVALUES ('{\"theme\": \"dark\", \"lang\": \"fr\"}');\n\n-- Lire un champ JSONB\nSELECT metadata->>'theme' AS theme FROM profiles;\n\n-- Filtrer sur un champ JSONB\nSELECT * FROM profiles\nWHERE metadata->>'lang' = 'fr';",
      },
      {
        title: "Row Level Security (RLS)",
        content:
          "RLS est LA fonctionnalite de securite de Supabase. Elle permet de definir qui peut voir/modifier quoi au niveau de chaque ligne. Sans RLS, n'importe qui avec la cle API peut tout lire.",
        code: '-- Activer RLS sur une table\nALTER TABLE profiles ENABLE ROW LEVEL SECURITY;\n\n-- Politique : les users ne voient que leur propre profil\nCREATE POLICY "Users see own profile"\nON profiles FOR SELECT\nUSING (auth.uid() = id);\n\n-- Politique : les users peuvent modifier leur profil\nCREATE POLICY "Users update own profile"\nON profiles FOR UPDATE\nUSING (auth.uid() = id);',
      },
      {
        title: "Patterns Supabase courants",
        content:
          "Voici les patterns SQL que tu retrouves dans presque tous les projets Supabase :",
        code: '-- 1. Table avec timestamps auto\nCREATE TABLE posts (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,\n  title TEXT NOT NULL,\n  content TEXT,\n  published BOOLEAN DEFAULT false,\n  created_at TIMESTAMPTZ DEFAULT now(),\n  updated_at TIMESTAMPTZ DEFAULT now()\n);\n\n-- 2. Trigger pour updated_at automatique\nCREATE OR REPLACE FUNCTION update_modified()\nRETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = now();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER set_updated\nBEFORE UPDATE ON posts\nFOR EACH ROW EXECUTE FUNCTION update_modified();\n\n-- 3. Politique RLS complete\nALTER TABLE posts ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY "Public read published"\nON posts FOR SELECT\nUSING (published = true);\n\nCREATE POLICY "Authors manage own"\nON posts FOR ALL\nUSING (auth.uid() = user_id);',
      },
    ],
  },
];

// ============================================
// Progress
// ============================================
function loadProgress() {
  try {
    const saved = localStorage.getItem("labo-ia-sql-progress");
    if (saved) completedSections = new Set(JSON.parse(saved));
  } catch (e) {
    completedSections = new Set();
  }
}

function saveProgress() {
  localStorage.setItem(
    "labo-ia-sql-progress",
    JSON.stringify([...completedSections]),
  );
}

// ============================================
// Rendering
// ============================================
function renderSidebar() {
  const nav = document.getElementById("sidebar-nav");
  let html = "";
  let currentCategory = "";

  const categoryLabels = {
    intro: "Introduction",
    select: "Requetes SELECT",
    aggregation: "Agregation",
    modification: "Modification",
    jointures: "Jointures",
    structure: "Structure",
    supabase: "Supabase",
  };

  SECTIONS.forEach((section, index) => {
    if (section.category !== currentCategory) {
      currentCategory = section.category;
      html += `<li class="sidebar-section-title">${categoryLabels[currentCategory]}</li>`;
    }

    const isActive = index === currentSectionIndex;
    const isCompleted = completedSections.has(section.id);
    const classes = [
      "sidebar-item",
      isActive ? "active" : "",
      isCompleted ? "completed" : "",
    ]
      .filter(Boolean)
      .join(" ");

    html += `
      <li class="${classes}" data-index="${index}" onclick="navigateTo(${index})">
        <span class="sidebar-check">${isCompleted ? "\u2713" : ""}</span>
        <span class="sidebar-item-number">${index === 0 ? "" : index}</span>
        <span class="sidebar-item-text">${section.title}</span>
      </li>
    `;
  });

  nav.innerHTML = html;
}

function renderSection() {
  const container = document.getElementById("sections-container");
  const section = SECTIONS[currentSectionIndex];

  if (section.isWelcome) {
    container.innerHTML = renderWelcome();
  } else if (section.isTheory) {
    container.innerHTML = renderTheoryLesson(section);
  } else {
    container.innerHTML = renderSqlLesson(section);
    initSqlEditor(section);
  }

  updateProgress();
  renderSidebar();
}

function renderWelcome() {
  const completed = completedSections.size;
  const total = SECTIONS.length - 1;

  return `
    <div class="section active">
      <div class="welcome-hero">
        <h1>Apprendre SQL & PostgreSQL</h1>
        <p>16 lecons interactives pour maitriser SQL. Execute de vraies requetes, vois les resultats en direct !</p>
      </div>

      <div class="welcome-cards">
        <div class="welcome-card">
          <div class="welcome-card-icon">&#128187;</div>
          <h3>Vraie base de donnees</h3>
          <p>Un moteur SQL tourne dans ton navigateur avec des donnees realistes</p>
        </div>
        <div class="welcome-card">
          <div class="welcome-card-icon">&#9889;</div>
          <h3>Resultats instantanes</h3>
          <p>Execute tes requetes et vois les resultats en tableau</p>
        </div>
        <div class="welcome-card">
          <div class="welcome-card-icon">&#128640;</div>
          <h3>Adapte a Supabase</h3>
          <p>Apprends le SQL que tu utilises vraiment avec Supabase</p>
        </div>
        <div class="welcome-card">
          <div class="welcome-card-icon">&#128218;</div>
          <h3>4 tables d'entrainement</h3>
          <p>users, products, orders, reviews — un e-commerce complet</p>
        </div>
      </div>

      ${completed > 0 ? `<p style="text-align:center;color:#10B981;font-weight:600;margin-bottom:8px;">${completed}/${total} sections completees !</p>` : ""}

      <div style="text-align:center;">
        <button class="btn-start" onclick="navigateTo(1)">
          ${completed > 0 ? "Reprendre" : "Commencer"} &#8594;
        </button>
      </div>
    </div>
  `;
}

function renderSchemaPanel() {
  const schema = getSchema();
  const isOpen = schemaOpen;

  let tablesHtml = schema
    .map(
      (table) => `
    <div class="schema-table-card">
      <div class="schema-table-name">${table.name}</div>
      <ul class="schema-columns">
        ${table.columns
          .map(
            (col) => `
          <li>
            <span class="schema-col-name">${col.pk ? "\u{1F511} " : ""}${col.name}</span>
            <span class="schema-col-type">${col.type}${col.notnull ? " NOT NULL" : ""}</span>
          </li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `,
    )
    .join("");

  return `
    <div class="schema-panel">
      <button class="schema-toggle" onclick="toggleSchema()">
        <span>Tables disponibles (${schema.length})</span>
        <span class="schema-toggle-icon ${isOpen ? "open" : ""}">\u25BC</span>
      </button>
      <div class="schema-content ${isOpen ? "open" : ""}">
        ${tablesHtml}
      </div>
    </div>
  `;
}

function renderSqlLesson(section) {
  const isCompleted = completedSections.has(section.id);
  const hasPrev = currentSectionIndex > 0;
  const hasNext = currentSectionIndex < SECTIONS.length - 1;
  const lessonNum = currentSectionIndex;
  const totalLessons = SECTIONS.length - 1;

  let tipsHtml = "";
  if (section.tips) {
    tipsHtml = `
      <div class="info-card">
        <h3>Syntaxe & commandes</h3>
        <ul>
          ${section.tips.map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  return `
    <div class="section active">
      <div class="section-header">
        <div class="section-badge">
          &#128451; SQL &mdash; Lecon ${lessonNum}/${totalLessons}
        </div>
        <h1 class="section-title">${section.title}</h1>
        <p class="section-description">${section.description}</p>
      </div>

      ${tipsHtml}
      ${renderSchemaPanel()}

      <div class="editor-container">
        <div class="editor-header">
          <div class="editor-header-label">
            <span class="dot"></span> Editeur SQL
          </div>
          <div class="editor-actions">
            <button class="btn-editor" onclick="resetQuery()">&#8634; Reset</button>
          </div>
        </div>
        <textarea class="editor-textarea" id="sql-editor" spellcheck="false" placeholder="Ecris ta requete SQL ici...">${escapeHtml(section.sql || "")}</textarea>
        <div class="editor-run-bar">
          <button class="btn-run" onclick="runQuery()">&#9654; Executer</button>
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="run-shortcut">Ctrl+Enter</span>
            <button class="btn-reset-db" onclick="handleResetDb()">&#8635; Reset DB</button>
          </div>
        </div>
      </div>

      <div class="results-panel" id="results-panel">
        <div class="results-header">
          <span class="dot"></span> Resultats
        </div>
        <div class="results-body" id="results-body">
          <div class="results-placeholder">Clique sur "Executer" ou appuie sur Ctrl+Enter pour lancer ta requete.</div>
        </div>
      </div>

      <div class="completion-row ${isCompleted ? "completed" : ""}" id="completion-row">
        <label class="completion-label">
          <input type="checkbox" class="completion-checkbox" id="completion-check"
            ${isCompleted ? "checked" : ""}
            onchange="toggleCompletion('${section.id}')">
          J'ai compris cette lecon
        </label>
        <div class="completion-nav">
          ${hasPrev ? `<button class="btn-nav" onclick="navigateTo(${currentSectionIndex - 1})">&#8592; Precedent</button>` : ""}
          ${hasNext ? `<button class="btn-nav btn-nav-next" onclick="navigateTo(${currentSectionIndex + 1})">Suivant &#8594;</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

function renderTheoryLesson(section) {
  const isCompleted = completedSections.has(section.id);
  const hasPrev = currentSectionIndex > 0;
  const hasNext = currentSectionIndex < SECTIONS.length - 1;
  const lessonNum = currentSectionIndex;
  const totalLessons = SECTIONS.length - 1;

  const blocksHtml = section.theoryBlocks
    .map(
      (block) => `
    <div class="theory-block">
      <h3>${block.title} <span class="pg-only-badge">PostgreSQL</span></h3>
      <p>${block.content}</p>
      <pre>${escapeHtml(block.code)}</pre>
    </div>
  `,
    )
    .join("");

  return `
    <div class="section active">
      <div class="section-header">
        <div class="section-badge">
          &#128024; Supabase &mdash; Lecon ${lessonNum}/${totalLessons}
        </div>
        <h1 class="section-title">${section.title}</h1>
        <p class="section-description">${section.description}</p>
      </div>

      <div class="info-card tip-card">
        <h3>Note importante</h3>
        <p>Cette lecon couvre la syntaxe PostgreSQL specifique a Supabase. Le code montre ici n'est pas executable dans cet editeur (qui utilise SQLite), mais c'est exactement ce que tu ecriras dans l'editeur SQL de Supabase.</p>
      </div>

      <div class="theory-content">
        ${blocksHtml}
      </div>

      <div class="completion-row ${isCompleted ? "completed" : ""}" id="completion-row">
        <label class="completion-label">
          <input type="checkbox" class="completion-checkbox" id="completion-check"
            ${isCompleted ? "checked" : ""}
            onchange="toggleCompletion('${section.id}')">
          J'ai compris cette lecon
        </label>
        <div class="completion-nav">
          ${hasPrev ? `<button class="btn-nav" onclick="navigateTo(${currentSectionIndex - 1})">&#8592; Precedent</button>` : ""}
          ${hasNext ? `<button class="btn-nav btn-nav-next" onclick="navigateTo(${currentSectionIndex + 1})">Suivant &#8594;</button>` : ""}
        </div>
      </div>
    </div>
  `;
}

// ============================================
// Results Rendering
// ============================================
function renderResults(result) {
  const body = document.getElementById("results-body");
  if (!body) return;

  if (result.type === "select") {
    if (result.columns.length === 0) {
      body.innerHTML = `<div class="results-success"><span class="results-success-icon">&#9989;</span> ${result.message || "Requete executee avec succes."}</div>`;
      return;
    }

    const maxRows = 100;
    const values = result.values.slice(0, maxRows);
    const truncated = result.values.length > maxRows;

    let tableHtml = `<div class="results-table-wrapper"><table class="results-table"><thead><tr>`;
    tableHtml += result.columns
      .map((c) => `<th>${escapeHtml(c)}</th>`)
      .join("");
    tableHtml += `</tr></thead><tbody>`;

    values.forEach((row) => {
      tableHtml += `<tr>`;
      row.forEach((val) => {
        if (val === null) {
          tableHtml += `<td class="null-value">NULL</td>`;
        } else {
          tableHtml += `<td>${escapeHtml(String(val))}</td>`;
        }
      });
      tableHtml += `</tr>`;
    });

    tableHtml += `</tbody></table></div>`;
    tableHtml += `<div class="results-meta">${result.values.length} ligne${result.values.length > 1 ? "s" : ""} retournee${result.values.length > 1 ? "s" : ""}${truncated ? ` (affichage limite a ${maxRows})` : ""}</div>`;

    body.innerHTML = tableHtml;
  } else if (result.type === "mutation") {
    const msg =
      result.queryType === "structure modifiee"
        ? "Structure de la base modifiee avec succes."
        : `${result.changes} ligne${result.changes > 1 ? "s" : ""} ${result.queryType}`;
    body.innerHTML = `<div class="results-success"><span class="results-success-icon">&#9989;</span> ${msg}</div>`;
  } else if (result.type === "error") {
    body.innerHTML = `
      <div class="results-error">
        <div class="results-error-title">&#10060; Erreur SQL</div>
        <div class="results-error-message">${escapeHtml(result.error)}</div>
      </div>
    `;
  }
}

// ============================================
// Editor Logic
// ============================================
function initSqlEditor(section) {
  const editor = document.getElementById("sql-editor");
  if (!editor) return;

  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value =
        editor.value.substring(0, start) + "  " + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
  });
}

function runQuery() {
  const editor = document.getElementById("sql-editor");
  if (!editor) return;

  const sql = editor.value;
  const result = executeQuery(sql);
  renderResults(result);
}

function resetQuery() {
  const section = SECTIONS[currentSectionIndex];
  const editor = document.getElementById("sql-editor");
  if (editor) editor.value = section.sql || "";

  const body = document.getElementById("results-body");
  if (body)
    body.innerHTML = `<div class="results-placeholder">Clique sur "Executer" ou appuie sur Ctrl+Enter pour lancer ta requete.</div>`;
}

function handleResetDb() {
  resetDatabase();
  const body = document.getElementById("results-body");
  if (body)
    body.innerHTML = `<div class="results-success"><span class="results-success-icon">&#9989;</span> Base de donnees reinitialisee avec succes.</div>`;

  // Re-render schema panel
  const schemaPanel = document.querySelector(".schema-panel");
  if (schemaPanel) {
    schemaPanel.outerHTML = renderSchemaPanel();
  }
}

function toggleSchema() {
  schemaOpen = !schemaOpen;
  const content = document.querySelector(".schema-content");
  const icon = document.querySelector(".schema-toggle-icon");
  if (content) content.classList.toggle("open");
  if (icon) icon.classList.toggle("open");
}

// ============================================
// Navigation & Progress
// ============================================
function navigateTo(index) {
  if (index < 0 || index >= SECTIONS.length) return;
  currentSectionIndex = index;
  renderSection();
  window.scrollTo({ top: 0, behavior: "smooth" });

  document.querySelector(".sidebar").classList.remove("open");
  document.querySelector(".sidebar-overlay").classList.remove("visible");
}

function toggleCompletion(sectionId) {
  const row = document.getElementById("completion-row");
  if (completedSections.has(sectionId)) {
    completedSections.delete(sectionId);
    row.classList.remove("completed");
  } else {
    completedSections.add(sectionId);
    row.classList.add("completed");

    const sidebarItem = document.querySelector(
      `.sidebar-item[data-index="${currentSectionIndex}"]`,
    );
    if (sidebarItem) {
      sidebarItem.classList.add("just-completed");
      setTimeout(() => sidebarItem.classList.remove("just-completed"), 500);
    }

    if (completedSections.size === SECTIONS.length - 1) {
      showCelebration();
    }
  }

  saveProgress();
  updateProgress();
  renderSidebar();
}

function updateProgress() {
  const total = SECTIONS.length - 1;
  const completed = completedSections.size;
  const percent = Math.round((completed / total) * 100);

  const fill = document.getElementById("progress-fill");
  const count = document.getElementById("progress-count");
  const label = document.getElementById("progress-label");

  if (fill) fill.style.width = percent + "%";
  if (count) count.textContent = `${completed}/${total}`;
  if (label) {
    if (percent === 0) label.textContent = "Progression";
    else if (percent < 50) label.textContent = "En cours...";
    else if (percent < 100) label.textContent = "Presque !";
    else label.textContent = "Termine !";
  }
}

function showCelebration() {
  const overlay = document.getElementById("celebration");
  if (overlay) overlay.classList.add("visible");
}

function closeCelebration() {
  const overlay = document.getElementById("celebration");
  if (overlay) overlay.classList.remove("visible");
}

function resetAllProgress() {
  if (confirm("Tu es sur de vouloir reinitialiser toute ta progression ?")) {
    completedSections.clear();
    saveProgress();
    updateProgress();
    renderSidebar();
    renderSection();
  }
}

// ============================================
// Mobile
// ============================================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  sidebar.classList.toggle("open");
  overlay.classList.toggle("visible");
}

// ============================================
// Utilities
// ============================================
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ============================================
// Init
// ============================================
document.addEventListener("DOMContentLoaded", async () => {
  loadProgress();

  try {
    await initDatabase();
    document.getElementById("loading").classList.add("hidden");
    renderSidebar();
    renderSection();
  } catch (e) {
    document.getElementById("loading").innerHTML = `
      <div style="text-align:center;padding:24px;">
        <p style="color:#EF4444;font-weight:700;margin-bottom:8px;">Erreur de chargement</p>
        <p style="color:#868E96;font-size:0.85rem;">${escapeHtml(e.message)}</p>
        <button onclick="location.reload()" style="margin-top:16px;padding:8px 20px;background:#2563EB;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;">Reessayer</button>
      </div>
    `;
  }

  document
    .querySelector(".sidebar-overlay")
    .addEventListener("click", toggleSidebar);
});
