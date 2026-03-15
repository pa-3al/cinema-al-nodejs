

export interface getAllResponse<T> {
    data : T[],
    page : number,
    size : number,
    totalCount : number,
    totalPage : number,
}