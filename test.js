'use strict';

var expect = require('chai').expect;
var SyntaxParser = require('./dist/parser.js').SyntaxParser;
var Tokenizer = require('./dist/token.js').Tokenizer;
var TokenType = require('./dist/token.js').TokenType;

var StringExpression = require('./dist/expression.js').StringExpression;
var BinaryExpression = require('./dist/expression.js').BinaryExpression;
var UnaryExpression = require('./dist/expression.js').UnaryExpression;
var BinaryOperation = require('./dist/expression.js').BinaryOperation;


describe('Tokenizer', () => {
    var tokenizer = new Tokenizer();

    it('should split simple query', () => {
        var query = "word1 AND word2 OR word3";

        var tokens = tokenizer.split(query);

        expect(tokens.length).to.equal(5);
        expect(tokens[0].type).to.equal(TokenType.Word);
        expect(tokens[1].type).to.equal(TokenType.AND);
        expect(tokens[2].type).to.equal(TokenType.Word);
        expect(tokens[3].type).to.equal(TokenType.OR);
        expect(tokens[4].type).to.equal(TokenType.Word);
    });

    it('should split complex query', () => {
        var query = "word1 AND (word2 OR word3)";

        var tokens = tokenizer.split(query);

        expect(tokens.length).to.equal(7);
        expect(tokens[0].type).to.equal(TokenType.Word);
        expect(tokens[1].type).to.equal(TokenType.AND);
        expect(tokens[2].type).to.equal(TokenType.BeginBracket);
        expect(tokens[3].type).to.equal(TokenType.Word);
        expect(tokens[4].type).to.equal(TokenType.OR);
        expect(tokens[5].type).to.equal(TokenType.Word);
        expect(tokens[6].type).to.equal(TokenType.EndBracket);
    });

    it('should split incorrect query', () => {
        var query = "word1 AND)))";

        var tokens = tokenizer.split(query);

        expect(tokens.length).to.equal(5);
        expect(tokens[0].type).to.equal(TokenType.Word);
        expect(tokens[1].type).to.equal(TokenType.AND);
        expect(tokens[2].type).to.equal(TokenType.EndBracket);
        expect(tokens[3].type).to.equal(TokenType.EndBracket);
        expect(tokens[3].type).to.equal(TokenType.EndBracket);
    });

    it('should split query with two or more words', () => {
        var query = "Hello world AND I am crazy AND Life is sucks";

        var tokens = tokenizer.split(query);

        expect(tokens.length).to.equal(5);

        expect(tokens[0].type).to.equal(TokenType.Word);
        expect(tokens[1].type).to.equal(TokenType.AND);
        expect(tokens[2].type).to.equal(TokenType.Word);
        expect(tokens[3].type).to.equal(TokenType.AND);
        expect(tokens[4].type).to.equal(TokenType.Word);

        expect(tokens[0].value).to.equal("Hello world");
        expect(tokens[1].value).to.equal("AND");
        expect(tokens[2].value).to.equal("I am crazy");
        expect(tokens[3].value).to.equal("AND");
        expect(tokens[4].value).to.equal("Life is sucks");

        expect(tokens[0].position).to.equal(0);
        expect(tokens[1].position).to.equal(12);
        expect(tokens[2].position).to.equal(16);
        expect(tokens[3].position).to.equal(27);
        expect(tokens[4].position).to.equal(31);
    });
});

describe('Parser', () => {

    it('should parse complex query', () => {
        var source = "Lorem ipsum dolor sit amet, lacus diam vehicula";
        var query  = "(Lorem OR ###) AND (sit OR @@@) AND (NOT ttt)";

        var expression = SyntaxParser.parse(source, query);
        var isMatch = expression.eval().Boolean();

        expect(isMatch).to.be.true;
    });

    it("should parse simple query", () => {
        var source = "Lorem ipsum dolor sit amet, lacus diam vehicula";
        var query  = "Loren AND %%%";

        var expression = SyntaxParser.parse(source, query);
        var isMatch = expression.eval().Boolean();

        expect(isMatch).to.be.false;
    });

    it("should parse unary query", () => {
        var source = "Lorem ipsum dolor sit amet, lacus diam vehicula";
        var query  = "NOT Lorem";

        var expression = SyntaxParser.parse(source, query);
        var isMatch = expression.eval().Boolean();

        expect(isMatch).to.be.false;
    });

    it("should parse word query", () => {
        var source = "Lorem ipsum dolor sit amet, lacus diam vehicula";
        var query  = "Lorem";

        var expression = SyntaxParser.parse(source, query);
        var isMatch = expression.eval().Boolean();

        expect(isMatch).to.be.true;
    });

    it("should throw exception if query is incorrect", () => {
        var source = "Lorem ipsum dolor sit amet, lacus diam vehicula";
        var query  = "Lorem OR )))";

        try {
            SyntaxParser.parse(source, query)
        } catch (err) {
            expect(err.message).to.be.equal("Invalid query (pos:9)")
        }
    });
    
});


describe("Expression", () => {
    it(" - BinaryExpression CONTAINS", () => {
        var exp = new BinaryExpression(
            new StringExpression("abb bbc ddd"),
            new StringExpression("ddd"),
            BinaryOperation.CONTAINS
        );

        var res = exp.eval().Boolean();

        expect(res).to.be.true;
    });

    it(" - BinaryExpression AND", () => {
        var exp = new BinaryExpression(
            new StringExpression("abb"), // false
            new StringExpression("ddd"), // false
            BinaryOperation.AND
        );

        var res = exp.eval().Boolean();

        expect(res).to.be.false;
    });

    it(" - BinaryExpression AND", () => {
        var exp = new BinaryExpression(
            new StringExpression("abb"), // false
            new StringExpression("ddd"), // false
            BinaryOperation.AND
        );

        var res = exp.eval().Boolean();

        expect(res).to.be.false;
    });

    it(" - BinaryExpression OR", () => {
        var exp = new BinaryExpression(
            new UnaryExpression(new StringExpression("abb")), // true
            new StringExpression("ddd"),                      // false
            BinaryOperation.OR
        );

        var res = exp.eval().Boolean();

        expect(res).to.be.true;
    });

    it(" - StringExpression", () => {
        var exp = new StringExpression("ddd");

        var res1 = exp.eval().String();
        var res2 = exp.eval().Boolean();

        expect(res1).to.be.equal("ddd");
        expect(res2).to.be.false;
    });

    it(" - UnaryExpression (NOT)", () => {
        var exp = new UnaryExpression(
            new StringExpression("ddd"));

        var res = exp.eval().Boolean();

        expect(res).to.be.true;
    });
});