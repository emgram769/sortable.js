class Table {
  constructor(columns, data, div, modifiers={}, sort_modifiers={}) {
    console.log('s');
    this.columns = columns;
    this.data = data;
    this.div = div;
    this.div.className = 'table';
    this.modifiers = modifiers;
    this.sort_modifiers = sort_modifiers;
  }

  sort(column, invert) {
    if (!this.columns.includes(column)) {
      throw "Column not in the table";
    }
    let index = this.columns.indexOf(column);

    let sort_func = function(x,y) {
      return x[index] < y[index];
    };
    if (this.sort_modifiers[column]) {
      sort_func = (function(x,y) {
        return this.sort_modifiers[column](x[index],y[index]);
      }).bind(this);
    }

    let sort = sort_func;
    if (invert) {
      sort = function(x,y) { return !sort_func(x,y); };
    }

    this.data = this.data.sort(sort);
    this.show();
  }

  clear() {
    while (this.div.hasChildNodes()) {
      this.div.removeChild(this.div.lastChild);
    }
  }

  show() {
    this.clear();
    // build header
    let header = document.createElement('tr');
    for (let column of this.columns) {
      let columnElem = document.createElement('th');
      columnElem.addEventListener('click', (function(){
        this.sort(column, this.last_clicked == column);
        if (this.last_clicked == column) {
          this.last_clicked = '';
        } else {
          this.last_clicked = column;
        }
      }).bind(this));
      columnElem.innerHTML = column;
      header.appendChild(columnElem);
    }
    this.div.appendChild(header);
    // fill in data
    for (let row of this.data) {
      let rowElem = document.createElement('tr');
      for (let i = 0; i < row.length; i++) {
        let datum = row[i];
        let column = this.columns[i];
        if (this.modifiers[column]) {
          datum = this.modifiers[column](datum);
        } else {
          datum = document.createTextNode(datum);
        }
        let datumElem = document.createElement('td');
        datumElem.appendChild(datum);
        rowElem.appendChild(datumElem);
      }
      this.div.appendChild(rowElem);
    }
  }
}
