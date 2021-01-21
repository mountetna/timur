export const addExchange = (exchange)=>{
  return {
    type: 'ADD_EXCHANGE',
    exchange_name: exchange.exchange_name,
    exchange: exchange
  };
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

    return fetch(path, options).finally(() => this.dispatch(removeExchange(this.exchange_name)));
  }
}
