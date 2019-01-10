'use strict';

var expect = require('chai').expect;
var SyntaxParser = require('./dist/parser.js').SyntaxParser;
var Tokenizer = require('./dist/token.js').Tokenizer;
var TokenType = require('./dist/token.js').TokenType;


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
});

describe('Parser', () => {

    it('should parse correct (match)', () => {
        var source = "Lorem ipsum dolor sit amet, lacus diam vehicula";
        var query  = "(Lorem OR ###) AND (sit OR @@@)";

        var expression = SyntaxParser.parse(source, query);
        var isMatch = expression.eval().Boolean();

        expect(isMatch).to.be.true;
    });

    it("should parse corect (doesn't match)", () => {
        var source = "Lorem ipsum dolor sit amet, lacus diam vehicula";
        var query  = "Loren AND %%%";

        var expression = SyntaxParser.parse(source, query);
        var isMatch = expression.eval().Boolean();

        expect(isMatch).to.be.false;
    });
    
});