export const addExchange = (exchange)=>{
  return {
    type: 'ADD_EXCHANGE',
    exchange_name: exchange.exchange_name,
    exchange: exchange
  };x
};

export const removeExchange = (exchange_name)=>{
  return {
    type: 'REMOVE_EXCHANGE',
    exchange_name: exchange_name
  };
};

export class Exchange{
  constructor(dispatch, exchange_name){
    this.dispatch = dispatch;
    this.exchange_name = exchange_name;
  }

  fetch(path, options){
    this.dispatch(
      addExchange({
        exchange_name: this.exchange_name,
        exchange_path: path,
        start_time: new Date()
      })
    );

    let localResponse = (response)=>{
      return new Promise((resolve, reject)=>{
        this.dispatch(removeExchange(this.exchange_name));
        resolve(response);
      })
    };

    return fetch(path, options).then(localResponse);
  }
}
