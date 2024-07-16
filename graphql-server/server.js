const { ApolloServer, gql } = require('apollo-server');

let cart = [
  { id: '1', name: 'The Lord of the Rings', price: 10, quantity: 1 },
  { id: '2', name: 'Harry Potter and the Chamber of Secrets (Illustrated Edition)', price: 15, quantity: 1 },
  { id: '3', name: 'Harry Potter and the Chamber of Secrets', price: 20, quantity: 1 },
  { id: '4', name: 'Harry Potter and the Prisoner of Azkaban', price: 15, quantity: 1 },
  { id: '5', name: 'Harry Potter and the Deathly Hallows', price: 20, quantity: 1 },
  { id: '6', name: 'Harry Potter and the Goblet of Fire', price: 15, quantity: 1 },
  { id: '7', name: 'The Witcher. 1. The Last Wish', price: 20, quantity: 1 },
  { id: '8', name: 'The Witcher. 4. Time of Contempt', price: 15, quantity: 1 },
  { id: '9', name: 'The Witcher. 6. The Tower of the Swallow', price: 20, quantity: 1 },
];

const typeDefs = gql`
  type CartItem {
    id: ID!
    name: String!
    price: Float!
    quantity: Int!
  }

  type Query {
    cart: [CartItem!]!
  }

  type Mutation {
    removeFromCart(id: ID!): CartItem
    updateQuantity(id: ID!, quantity: Int!): CartItem
    clearCart: [CartItem]
  }
`;

const resolvers = {
  Query: {
    cart: () => cart,
  },
  Mutation: {
    removeFromCart: (_, { id }) => {
      console.log('Removing item with id:', id);
      const itemIndex = cart.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        const removedItem = cart.splice(itemIndex, 1)[0];
        console.log('Removed item:', removedItem);
        return removedItem;
      }
      console.log('Item not found for removal:', id);
      return null;
    },
    updateQuantity: (_, { id, quantity }) => {
      console.log('Updating quantity for item with id:', id, 'to:', quantity);
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        console.log('Updated item:', item);
        return item;
      }
      console.log('Item not found for quantity update:', id);
      return null;
    },
    clearCart: () => {
      console.log('Clearing cart');
      const clearedCart = cart;
      cart = [];
      console.log('Cart cleared:', clearedCart);
      return clearedCart;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
