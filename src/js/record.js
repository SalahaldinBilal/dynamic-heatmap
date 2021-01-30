events = [];

rrwebRecord({
    emit(event){
        events.push(event);
        console.log(event);
    }
});