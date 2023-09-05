
export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

export const randomize = (array: any) => {
    return array[random(0, array.length)];
}
