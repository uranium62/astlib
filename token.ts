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

    private static SystemWords: { [name: string]: boolean; } = {
        "AND": true,
        "OR" : true,
        "NOT": true
    };

    public split(str: string): Token[] {
        var tokens: Token[] = [];
        var buffer: string = ""; 
        var cursor: number = 0;
        var word:   string = "";
        
        str = str + " ";
        for(var i = 0; i < str.length; i++){            
            switch (str[i]){
                case " ": {
                    if (Tokenizer.SystemWords[word]){
                        this.flush(tokens, buffer, cursor);
                        this.flush(tokens, word, i - word.length);
                        buffer = word = "";
                        cursor = i + 1;
                    } else {
                        let space = buffer ? " " : "";
                        buffer += space + word;
                        word = "";
                    }
                    break;
                }

                case "(": {
                    if (Tokenizer.SystemWords[word]){
                        this.flush(tokens, buffer, cursor);
                        this.flush(tokens, word, i - word.length);
                    } else {
                        this.flush(tokens, buffer + word, cursor);
                    }
                    this.flush(tokens, "(", i);
                    buffer = word = "";
                    cursor = i + 1;
                    break;
                }

                case ")": {
                    if (Tokenizer.SystemWords[word]){
                        this.flush(tokens, buffer, cursor);
                        this.flush(tokens, word, i - word.length);
                    } else {
                        this.flush(tokens, buffer + word, cursor);
                    }
                    this.flush(tokens, ")", i);
                    buffer = word = "";
                    cursor = i + 1;
                    break;
                }

                default: {
                    word += str[i];
                }
            }
        }

        this.flush(tokens, buffer + word, cursor);

        return tokens;
    }

    private flush(tokens: Token[], buffer: string, cursor: number) {

        if (buffer.length === 0){
            return;
        }

        switch(buffer) {
            case "(": {
                tokens.push(new Token(TokenType.BeginBracket, '(', cursor));
                break;
            }
            case ")": {
                tokens.push(new Token(TokenType.EndBracket, ')', cursor));
                break;
            }
            case "AND": {
                tokens.push(new Token(TokenType.AND, 'AND', cursor));
                break;
            }    
            case "OR": {
                tokens.push(new Token(TokenType.OR, 'OR', cursor));
                break;
            }
            case "NOT": {
                tokens.push(new Token(TokenType.NOT, 'NOT', cursor));
                break;
            }
            default:
                tokens.push(new Token(TokenType.Word, buffer, cursor));
                break;
        }
    }
}
