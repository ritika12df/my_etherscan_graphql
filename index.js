// Import ApolloServer and schema import utility from apollo-server
const { ApolloServer } = require("apollo-server"); 
// Import schema import utility
const { importSchema } = require("graphql-import");
// Import EtherDataSource data source class 
const EtherDataSource = require("./datasource/ethDatasource");

// Import GraphQL schema from schema file
const typeDefs = importSchema("./schema.graphql");  

// Load environment variables from .env file
require("dotenv").config();

// Define GraphQL resolvers
const resolvers = {
  Query: {
    // Resolver to get ether balance for an address
    etherBalanceByAddress: (root, _args, { dataSources }) =>  
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver to get total ether supply
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Resolver to get latest Ethereum price
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Resolver to get average block confirmation time
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    // Instantiate EtherDataSource
    ethDataSource: new EtherDataSource(), 
  }),
});

// Set no timeout 
server.timeout = 0;
// Start Apollo server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`); 
});