/* ==========================================================
   TIKIBURGER — carta (de la foto de la carta del local en
   Google Maps; original en català y castellano). Bebidas: solo
   los cócteles y combinados, que son los que se leen.
   L = capas de la burger de abajo arriba, para dibujarla.
   ========================================================== */
window.TK_CARTA = {
  burgers: [
    { id: 'mix', n: 'Mix Burger', p: 3.5, L: ['bun', 'patty', 'cheese', 'top'],
      d: { ca: 'Pa brioix, hamburguesa de porc i vedella i formatge', es: 'Pan brioche, hamburguesa de cerdo y ternera y queso', en: 'Brioche bun, pork-and-beef patty and cheese', fr: 'Pain brioché, steak porc-bœuf et fromage' } },
    { id: 'chicken', n: 'Chicken Burger', p: 5.9, L: ['bun', 'crispy', 'tomato', 'lettuce', 'top'],
      d: { ca: 'Pa brioix, hamburguesa de pollastre crispy, enciam i tomàquet', es: 'Pan brioche, hamburguesa de pollo crispy, lechuga y tomate', en: 'Brioche bun, crispy chicken, lettuce and tomato', fr: 'Pain brioché, poulet croustillant, salade et tomate' } },
    { id: 'clasic', n: 'Clasic Burger', p: 6.5, L: ['bun', 'lettuce', 'patty', 'cheddar', 'tomato', 'top'],
      d: { ca: 'Pa brioix, hamburguesa de vedella madurada, formatge cheddar, enciam, tomàquet', es: 'Pan brioche, hamburguesa de ternera madurada, queso, lechuga, tomate', en: 'Brioche bun, dry-aged beef patty, cheddar, lettuce, tomato', fr: 'Pain brioché, steak de bœuf maturé, cheddar, salade, tomate' } },
    { id: 'smash', n: 'Love Smash Chedar', p: 8.4, L: ['bun', 'smash', 'cheddar', 'smash', 'cheddar', 'sauce', 'crunch', 'top'],
      d: { ca: 'Pa brioix, 2 hamburgueses smash de vedella, 2 cheddar, salsa cheddar, ceba crispy', es: 'Pan brioche, 2 hamburguesas smash de ternera, 2 cheddar, salsa cheddar, cebolla crispy', en: 'Brioche bun, 2 beef smash patties, 2 cheddar, cheddar sauce, crispy onion', fr: 'Pain brioché, 2 steaks smash de bœuf, 2 cheddar, sauce cheddar, oignon croustillant' } },
    { id: 'trufada', n: 'Trufada', p: 7.9, L: ['bun', 'patty', 'bacon', 'egg', 'mayo', 'top'],
      d: { ca: 'Pa brioix, hamburguesa de vedella madurada, ou, bacó, maionesa trufada', es: 'Pan brioche, hamburguesa de ternera madurada, huevo, bacon, mayonesa trufada', en: 'Brioche bun, dry-aged beef patty, egg, bacon, truffle mayo', fr: 'Pain brioché, steak de bœuf maturé, œuf, bacon, mayonnaise à la truffe' } },
    { id: 'texas', n: 'Texas BBQ', p: 7.9, L: ['bun', 'patty', 'bacon', 'caramel', 'bbq', 'top'],
      d: { ca: 'Pa brioix, hamburguesa de vedella madurada, bacó, ceba caramel·litzada, salsa BBQ', es: 'Pan brioche, hamburguesa de ternera madurada, bacon, cebolla caramelizada, salsa BBQ', en: 'Brioche bun, dry-aged beef patty, bacon, caramelised onion, BBQ sauce', fr: 'Pain brioché, steak de bœuf maturé, bacon, oignon caramélisé, sauce BBQ' } },
    { id: 'tiki', n: 'Tiki Burger', p: 7.8, L: ['bun', 'sauce2', 'crispy', 'cheddar', 'cheddar', 'crunch', 'top'],
      d: { ca: 'Pa brioix, hamburguesa de pollastre crispy, 2 cheddar, ceba crispy i salsa tikiburger', es: 'Pan brioche, hamburguesa de pollo crispy, 2 cheddar, cebolla crispy y salsa tikiburger', en: 'Brioche bun, crispy chicken, 2 cheddar, crispy onion and tikiburger sauce', fr: 'Pain brioché, poulet croustillant, 2 cheddar, oignon croustillant et sauce tikiburger' } },
    { id: 'vegan', n: 'Vegan Burger', p: 7.5, L: ['vbun', 'vpatty', 'onion', 'tomato', 'lettuce', 'vtop'],
      d: { ca: 'Pa vegà, hamburguesa Linda McCartney, enciam, tomàquet i ceba', es: 'Pan vegano, hamburguesa Linda McCartney, lechuga, tomate y cebolla', en: 'Vegan bun, Linda McCartney patty, lettuce, tomato and onion', fr: 'Pain vegan, steak Linda McCartney, salade, tomate et oignon' } }
  ],
  // [català, castellano, english, français, precio]
  tapes: [
    ['Mini croquetes (8 u.)', 'Mini croquetas (8 u.)', 'Mini croquettes (8)', 'Mini croquettes (8)', 2],
    ['Croquetes pulled pork (4 u.)', 'Croquetas de pulled pork', 'Pulled pork croquettes', 'Croquettes de pulled pork', 5.5],
    ['Patates fregides', 'Patatas fritas', 'Chips', 'Frites', 3.7],
    ['Patates braves', 'Patatas bravas', 'Patatas bravas', 'Patatas bravas', 4.7],
    ['Patates de moniato', 'Patatas de boniato', 'Sweet potato fries', 'Frites de patate douce', 4.5],
    ['Fingers de pollastre (6 u.)', 'Fingers de pollo (6 u.)', 'Chicken fingers (6)', 'Fingers de poulet (6)', 5.4],
    ['Nuggets (6 u.)', 'Nuggets (6 u.)', 'Nuggets (6)', 'Nuggets (6)', 4],
    ['Formatge camembert arrebossat (4 u.)', 'Queso camembert empanado (4 u.)', 'Breaded camembert (4)', 'Camembert pané (4)', 6],
    ['Nachos Tiki', 'Nachos Tiki', 'Tiki nachos', 'Nachos Tiki', 5],
    ['Anelles de ceba', 'Aros de cebolla', 'Onion rings', 'Rondelles d’oignon', 4],
    ['Pebrots del Padrón', 'Pimientos del Padrón', 'Padrón peppers', 'Piments de Padrón', 2.9]
  ],
  entrepans: [
    ['Frankfurt', 'Frankfurt', 'Frankfurter', 'Francfort', 3.8],
    ['Frikandela', 'Frikandela', 'Frikandel', 'Frikandel', 4.8],
    ['Bacó', 'Bacon', 'Bacon', 'Bacon', 4.9],
    ['Trueno', 'Trueno', 'Trueno', 'Trueno', 6.9]
  ],
  postres: [
    ['Tequeños de Nutella', 'Tequeños de Nutella', 'Nutella tequeños', 'Tequeños au Nutella', 6.5],
    ['Tequeño de Kinder Bueno', 'Tequeño de Kinder Bueno', 'Kinder Bueno tequeño', 'Tequeño au Kinder Bueno', 6.5],
    ['Cheese cake', 'Cheese cake', 'Cheesecake', 'Cheesecake', 5.9],
    ['Coulant', 'Coulant', 'Chocolate coulant', 'Coulant au chocolat', 6],
    ['Crema catalana', 'Crema catalana', 'Crema catalana', 'Crème catalane', 5],
    ['Gelat de torró amb ratafia', 'Helado de turrón con ratafía', 'Turrón ice cream with ratafia', 'Glace au touron et ratafia', 5.5]
  ],
  extres: [
    ['Formatge', 'Queso', 'Cheese', 'Fromage', 0.9],
    ['Ceba caramel·litzada', 'Cebolla caramelizada', 'Caramelised onion', 'Oignon caramélisé', 1.2],
    ['Bacó', 'Bacon', 'Bacon', 'Bacon', 1.6],
    ['Pa sense gluten', 'Pan sin gluten', 'Gluten-free bun', 'Pain sans gluten', 2],
    ['Salsa cheddar', 'Salsa cheddar', 'Cheddar sauce', 'Sauce cheddar', 0.5],
    ['Salsa yuppie', 'Salsa yuppie', 'Yuppie sauce', 'Sauce yuppie', 0.5],
    ['Salsa picant', 'Salsa picante', 'Hot sauce', 'Sauce piquante', 0.5]
  ],
  coctels: [
    { n: 'Mojito', p: 6.5, c: ['#E9F7D9', '#7CC36B'] },
    { n: 'Caipirinha', p: 6.5, c: ['#F4F7D2', '#B8D45A'] },
    { n: 'Margarita', p: 6.5, c: ['#F6F3C8', '#D9E36A'] },
    { n: 'Piña colada', p: 6.5, c: ['#FFF7E6', '#F2D9A8'] },
    { n: 'Sex on the beach', p: 6.9, c: ['#FFD27A', '#E4473C'] },
    { n: 'Blue lagoon', p: 6.9, c: ['#8FE3F2', '#1E7FD6'] },
    { n: 'Tiki Volcano XXL', p: 11.9, c: ['#FFB13C', '#D42D1E'], xxl: true }
  ],
  combinats: [
    ['Combinat', 'Combinado', 'Spirit & mixer', 'Long drink', 6],
    ['Combinat prèmium', 'Combinado prémium', 'Premium spirit & mixer', 'Long drink premium', 7.9],
    ['Copa balón (suplement)', 'Copa balón (suplemento)', 'Balloon glass (extra)', 'Verre ballon (supplément)', 1]
  ]
};
