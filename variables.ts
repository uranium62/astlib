export class Variables {
    private map: { [name: string]: string; } = {};

    add(name: string, value: string){
        this.map[name] = value;
    }
    get(name: string): string {
        return this.map[name];
    }
}