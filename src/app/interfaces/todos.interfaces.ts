//Passing id and Todo params

interface IParams{
    id: string;
}

interface Todo{
    title:string;
    completed:boolean;
    dateOfCreation:Date;
    dateOfCompletion:Date;
    imageLink:string;
}

export {IParams,Todo};