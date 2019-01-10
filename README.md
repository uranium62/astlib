# astlib 

## Description
A simple library for parsing AST expressions

## Build
```
npm install
npm run build
```

## Tests
``
npm run test
``

## Examples
```
    var source = "Lorem ipsum dolor sit amet, lacus diam vehicula";
    var query  = "(Lorem OR ###) AND (sit OR @@@)";

    // Parse query and build AST expression 
    var expression = SyntaxParser.parse(source, query);
    
    // Execute expression
    var isMatch = expression.eval().Boolean();
```