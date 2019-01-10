import { Expression, BinaryExpression, VariableExpression, StringExpression, BinaryOperation, UnaryExpression } from "./expression";
import { Token, TokenType, Tokenizer } from "./token";
import { Variables } from "./variables";

export class SyntaxParser {

    private position: number;
    private size: number;
    private tokens: Token[];
    private variables: Variables;

    constructor(tokens: Token[], variables: Variables) {
        this.position = 0;
        this.size = tokens.length;
        this.tokens = tokens;
        this.variables = variables
    }

    private static EOF: Token = new Token(TokenType.EOF, '', -1);
      
    private get(relativePosition: number): Token {
        var pos = this.position + relativePosition;

        if (pos >= this.size){
            return SyntaxParser.EOF;
        } else {
            return this.tokens[pos];
        }
    }

    private match(tokenType: TokenType): boolean {
        var current = this.get(0);

        if (current.type !== tokenType) {
            return false;
        } else {
            this.position++;
            return true;
        }
    }

    public parse(): Expression {
        let result = this.expression();
        
        return result;
    }

    private expression(): Expression{
        return this.binary();
    }

    private binary(): Expression {
        let result = this.unary();

        while(true){
            if (this.match(TokenType.AND)){
                result = new BinaryExpression(result, this.unary(), BinaryOperation.AND);
                continue;
            }
            if (this.match(TokenType.OR)){
                result = new BinaryExpression(result, this.unary(), BinaryOperation.OR);
                continue;
            }
            break;
        }

        return result;
    }

    private unary(): Expression {
        if (this.match(TokenType.NOT)){
            return new UnaryExpression(this.primary());
        }
        return this.primary();
    }

    private primary(): Expression {
        let token = this.get(0);

        if (this.match(TokenType.Word)){
            return new BinaryExpression(
                new VariableExpression("source", this.variables),
                new StringExpression(token.value),
                BinaryOperation.CONTAINS
            );
        } 
        if (this.match(TokenType.BeginBracket)){
            let result = this.expression();
            this.match(TokenType.EndBracket);
            return result;
        }

        throw new Error(`Invalid query (pos:${token.position})`)
    }
   
    private static tokenizer: Tokenizer = new Tokenizer();
    
    static parse(source: string, query: string) : Expression {
        
        // Add local variable to AST
        let variables = new Variables();
        variables.add("source", source);

        // Split query for tokens
        let tokens = this.tokenizer.split(query);
        let parser = new SyntaxParser(tokens, variables);

        // Parse query to expression
        return parser.parse();
    }
}