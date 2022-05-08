export class Piece {
    #image;
    #type;
    #color;
    #offset_x;
    #offest_y;

    constructor(image, type, color, grid_size) {
        this.#image = image;
        this.#type = type;
        this.#color = color;
        this.#offset_x = Math.floor((grid_size - image.width) / 2);
        this.#offest_y = Math.floor((grid_size - image.height) / 2);
    }

    getType() {
        return this.#type;
    }

    getImage() {
        return this.#image;
    }

    getOffset() {
        return {
            x: this.#offset_x,
            y: this.#offest_y
        };
    }

    getColor() {
        return this.#color;
    }
}