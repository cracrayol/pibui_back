export class Page<T> {
    data : T[];
    total : number;

    constructor(init: [T[], number]) {
        this.data = init[0];
        this.total = init[1];
    }
}