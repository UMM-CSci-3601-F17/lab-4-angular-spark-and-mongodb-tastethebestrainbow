Questions
1.) The server makes access control requests for headers and methods to implement HTTP commands for interaction. The UserController constructor in this case is accessing a server side constructor rather than another client side class. The data retrieved is then accessed in a client side directory, userCollection, for access/display. The server constructor coordinates the specified MongoDB to the UserController.

2.) By inserting the desired ID for the string parameter, we iterate over the database to check if there is a matching ID. If there are any values, they are converted into JSON format and retrieved.

3.) By passing checking for an age parameter through the getUsers to see if an age is being passed. filterDoc then retrieves that parameter and iterates over the userCollection, checking against that value to return it's paired user.

4.)A document object is an implemented map or hashtable, used to store a string and a paired object. Can be used, in this case is, to access the database for specified information and mapped accordingly.

5.) Empties the local MongoDB of entries and then proceeds to add usernames (and parameters) for testing. Used when you would like to make sure your parameters match the data being tested, without manually doing so.

6.) Tests the parameter "age" of a user, more importantly that it is being routed properly and retrieved from the server. By expecting a certain amount of users that have age 37, this case 2, we can test that the age is properly being returned and counted.  
