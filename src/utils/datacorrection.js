export function checkArray (data){
    if(!data)return[];
    if(!Array.isArray(data))return[];
    return data;
}

