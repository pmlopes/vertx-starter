import { TestSuite } from '@vertx/unit';

const suite = TestSuite.create("the_test_suite");

suite.test("my_test_case", function (should) {
  var s = "value";
  should.assertEquals("value", s);
});

suite.run();
