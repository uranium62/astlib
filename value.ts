export interface Value {
    String(): string;
    Boolean(): boolean;
}

export class StringValue implements Value {
    private value: string;

    constructor(value: string) {
        this.value = value;
    }

    String(){
        return this.value;
    }
    Boolean(){
        return false;
    }
}

export class BooleanValue implements Value {
    private value: boolean;

    constructor(value: boolean){
        this.value = value;
    }

    String(){
        return "";
    }
    Boolean(){
        return this.value;
    }
}