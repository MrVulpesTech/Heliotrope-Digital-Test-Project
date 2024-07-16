const { ApolloServer, gql } = require('apollo-server');

let cart = [];

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
    addToCart(id: ID!, name: String!, price: Float!, quantity: Int!): CartItem
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
    addToCart: (_, { id, name, price, quantity }) => {
      const existingItem = cart.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity += quantity;
        return existingItem;
      }
      const newItem = { id, name, price, quantity };
      cart.push(newItem);
      return newItem;
    },
    removeFromCart: (_, { id }) => {
      const itemIndex = cart.findIndex(item => item.id === id);
      if (itemIndex > -1) {
        const removedItem = cart.splice(itemIndex, 1)[0];
        return removedItem;
      }
      return null;
    },
    updateQuantity: (_, { id, quantity }) => {
      const item = cart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        return item;
      }
      return null;
    },
    clearCart: () => {
      const clearedCart = [...cart];
      cart = [];
      return clearedCart;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
