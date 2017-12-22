//Super stack class:

class Stack {
  constructor() {
    this.rep = [];
    this.size = 0;
  }

  pop() {
    this.size = this.size - 1;
    var top = this.rep[this.rep.length - 1];
    this.rep.pop();
    return top;
  }

  push(element) {
    this.rep.push(element);
    this.size = this.size + 1;
  }

  size() {
    return this.size;
  }
}

class ObservableStack extends Stack {
  constructor() {
    super();
    this.observers = [];
  }
  registerObserver(observer) {
    this.observers.push(observer);
  }
  pop() {
    var top = super.pop();
    for (var i =0; i < this.observers.length; i++) {
      this.observers[i];
    }
    return top;
  }
  push(element) {
    super.push(element);
    for (var i =0; i < this.observers.length; i++) {
      this.observers[i];
    }
  }
  size() {
    super.size();
  }
}

//Is this okay??? Probably would be good to try to test it before going onto the next step


// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript
var words = {};
words["+"] = add;
words["-"] = sub;
words["*"] = mult;
words["/"] = div;
words["nip"] = nip;
words["swap"] = swap;
words["over"] = over;
words[">"] = greater_than;
words["<"] = less_than;
words["="] = equal_to;

var userDef = {};

var userButtons = [];


/**
 * Your thoughtful comment here.
 */
function emptyStack(stack) {
    //print(terminal, "Got to emptyStack");
    var size = stack.length;
    for (i = 0; i < size; i++) {
      stack.pop()
    }
}

function add(stack) {
  var top = stack.pop();
  var second = stack.pop();
  stack.push(top + second);
}

function sub(stack) {
  var top = stack.pop();
  var second = stack.pop();
  stack.push(second - top);
}

function mult(stack) {
  var top = stack.pop();
  var second = stack.pop();
  stack.push(top * second);
}

function div(stack) {
  var top = stack.pop();
  var second = stack.pop();
  stack.push(second / top);
}

function nip(stack) {
  var top = stack.pop();
  stack.pop();
  stack.push(top);
}

function swap(stack) {
  var top = stack.pop();
  var second = stack.pop();
  stack.push(top);
  stack.push(second);
}

function over(stack) {
  var top = stack.pop();
  var second = stack.pop();
  stack.push(second);
  stack.push(top);
  stack.push(second);
}

function greater_than(stack) {
  var top = stack.pop();
  var second = stack.pop();
  if (second > top) {
    stack.push(-1);
  } else {
    stack.push(0);
  }
}

function less_than(stack) {
  var top = stack.pop();
  var second = stack.pop();
  if (second < top) {
    stack.push(-1);
  } else {
    stack.push(0);
  }
}

function equal_to(stack) {
  var top = stack.pop();
  var second = stack.pop();
  if (second === top) {
    stack.push(-1);
  } else {
    stack.push(0);
  }
}

function funcButtonClicked(stack, funcBody, terminal) {
  for (var i = 0; i < funcBody.length; i++) {
    process(stack, funcBody[i], terminal);
  }
}





/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}

/**
 * Sync up the HTML with the stack in memory
 * @param {Stack} The stack to render
 */
function renderStack(stack) {
    $("#thestack").empty();
    stack.rep.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};

/**
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Stack} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */
function process(stack, input, terminal) {
    // The user typed a number
    if (!(isNaN(Number(input)))) {
        print(terminal,"pushing " + Number(input));
        stack.push(Number(input));
    } else if (input == ".s") {
      var length = stack.size;
      print(terminal, " <" + length + "> " + stack.rep.slice().join(" "));
    } else if (input in words) {
        words[input](stack);
    } else if (input in userDef) {
      var functionDef = userDef[input];
      //print(terminal, "processing user defined function: " + input);
      //print(terminal, userDef[input][0]);
      for (var i = 0; i < functionDef.length; i++) {
        process(stack, functionDef[i], terminal);
      }
    } else {
        print(terminal, ":-( Unrecognized input" + input);
    }
    //renderStack(stack);
};

function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        debugger;
        print(terminal, "User typed in: " + line);
        var in_list = line.trim().split(/ +/);
        if (in_list[0] === ":") {
          var funcName = in_list[1];
          var funcBody = in_list.slice(2, in_list.length - 1);
          userDef[funcName] = funcBody;
          //The following code is based off code from https://jsfiddle.net/mmv1219/koqpzrar/1/ (found on one of the StackOverflow pages linked to in the README)
          var div = document.getElementById('user-defined-funcs');
          var btn = document.createElement('button');
          var txt = document.createTextNode(funcName);
          div.appendChild(btn);
          btn.appendChild(txt);
          btn.setAttribute('type', 'button');
          btn.setAttribute('id', funcName);
          var funcButton = $("#" + funcName);
          funcButton.click(function() {
            for (var j = 0; j < userDef[funcName].length; j++) {
              process(stack, userDef[funcName][j], terminal);
          }
          });
          //userButtons.push(btn);
          // Go look at Piazza!!!

        } else {
          for (var i = 0; i < in_list.length; i++) {
            process(stack, in_list[i], terminal);
            //print(terminal, i);
          }
        }

        var resetButton = $("#reset");
        resetButton.click(function() {
          emptyStack(stack);
          //renderStack(stack);
          print(terminal, "The stack has been reset");
        });
        runRepl(terminal, stack);
    });
};
/*
function funcButtonClicked(stack, functionBody, terminal) {
  for (var i = 0; i < functionBody.length; i++) {
    process(stack, functionBody[i], terminal);
};
*/

// Whenever the page is finished loading, call this function.
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);

    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);

    let stack = new ObservableStack();
    stack.registerObserver(renderStack);
    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");

    runRepl(terminal, stack);

});
