import { Value, StringValue, BooleanValue } from "./value";
import { Variables } from "./variables";

export enum BinaryOperation {
    AND,
    OR,
    CONTAINS
} 

export interface Expression {
    eval(): Value;
}

export class StringExpression implements Expression {

    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    eval(): Value {
        return new StringValue(this.value);
    }
}

export class BinaryExpression implements Expression {

    private left: Expression;
    private right: Expression;
    private operation: BinaryOperation;

    constructor(left: Expression, right: Expression, operation: BinaryOperation) {
        this.left = left;
        this.right = right;
        this.operation = operation;
    }

    eval(): Value {
        switch (this.operation){
            case BinaryOperation.AND:
                return new BooleanValue(this.left.eval().Boolean() && this.right.eval().Boolean());

            case BinaryOperation.OR:
                return new BooleanValue(this.left.eval().Boolean() || this.right.eval().Boolean());

            case BinaryOperation.CONTAINS:
                return new BooleanValue(this.left.eval().String().indexOf(this.right.eval().String()) >= 0)
        }
    }
}

export class UnaryExpression implements Expression {

    private exp: Expression;

    constructor(exp: Expression) {
        this.exp = exp;
    }

    eval() : Value {
        return new BooleanValue(!this.exp.eval().Boolean());
    }
}

export class VariableExpression implements Expression {

    private name: string;
    private variables: Variables;

    constructor(name: string, variables: Variables) {
        this.name = name;
        this.variables = variables;
    }
    
    eval(): Value {
        return new StringValue(this.variables.get(this.name));
    }
}