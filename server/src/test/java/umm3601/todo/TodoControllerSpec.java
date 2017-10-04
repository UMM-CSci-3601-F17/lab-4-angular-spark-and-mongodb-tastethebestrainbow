package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.assertEquals;

/**
 * JUnit tests for the TodoController.
 *
 * Created by mcphee on 22/2/17.
 */
public class TodoControllerSpec
{
    private TodoController todoController;

    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Chris\",\n" +
            "                    category: \"Games\",\n" +
            "                    body: \"Games are fun\",\n" +
            "                    status: \"Complete\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Chris\",\n" +
            "                    category: \"Fish\",\n" +
            "                    body: \"Salmon are tasty\",\n" +
            "                    status: \"Complete\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    owner: \"Liam\",\n" +
            "                    category: \"Fish\",\n" +
            "                    body: \"Carp is tasty\",\n" +
            "                    status: \"In-Progress\"\n" +
            "                }"));


        todoDocuments.insertMany(testTodos);

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        todoController = new TodoController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
            = CodecRegistries.fromProviders(Arrays.asList(
            new ValueCodecProvider(),
            new BsonValueCodecProvider(),
            new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }


    @Test
    public void getAllTodos() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 3 todos", 3, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedOwners = Arrays.asList("Chris", "Chris", "Liam");
        assertEquals("Names should match", expectedOwners, names);
    }

    @Test
    public void testByStatus() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("status", new String[] { "Complete" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Chris", "Chris");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void testByBody() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("body", new String[] { "Salmon are tasty" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 1 todo", 1, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Chris");
        assertEquals("Names should match", expectedNames, names);
    }

    @Test
    public void testByCategory() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("category", new String[] { "Fish" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todo", 2, docs.size());
        List<String> names = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Chris", "Liam");
        assertEquals("Names should match", expectedNames, names);
    }
}
