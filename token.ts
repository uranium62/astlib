
export enum TokenType {
    Word,
    AND,
    OR,
    NOT,
    BeginBracket,
    EndBracket,
    EOF
}

export class Token {
    type: TokenType;
    value: string;
    position: number;

    constructor(type: TokenType, value: string, pos: number) {
        this.type = type;
        this.value = value;
        this.position = pos;
    }
}

export class Tokenizer {
    
    public split(str: string): Token[] {
        var tokens: Token[] = [];
        var buffer: string  = ""; 
        var cursor: number = 0;
        
        for(var i = 0; i < str.length; i++){            
            switch (str[i]){
                case " ": {
                    this.flush(tokens, buffer, cursor);
                    buffer = "";
                    cursor = i + 1;
                    break;
                }
                case "(": {
                    this.flush(tokens, buffer, cursor);
                    tokens.push(new Token(TokenType.BeginBracket, '', i));
                    buffer = ""
                    cursor = i + 1;
                    break;
                }
                case ")": {
                    this.flush(tokens, buffer, cursor);
                    tokens.push(new Token(TokenType.EndBracket, '', i));
                    buffer = "";
                    cursor = i + 1;
                    break;
                }
                default: {
                    buffer += str[i];
                }
            }
        }

        this.flush(tokens, buffer, cursor);

        return tokens;
    }

    private flush(tokens: Token[], buffer: string, cursor: number) {

        if (buffer.length === 0){
            return;
        }

        switch(buffer) {
            case "AND": {
                tokens.push(new Token(TokenType.AND, '', cursor));
                break;
            }    
            case "OR": {
                tokens.push(new Token(TokenType.OR, '', cursor));
                break;
            }
            case "NOT": {
                tokens.push(new Token(TokenType.NOT, '', cursor));
                break;
            }
            default:
                tokens.push(new Token(TokenType.Word, buffer, cursor));
        }
    }
}
