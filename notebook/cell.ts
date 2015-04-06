module Notebook {

import DOM = phosphor.virtualdom.dom;
import Component = phosphor.components.Component;
import IElement = phosphor.virtualdom.IElement;
import IData = phosphor.virtualdom.IData;
import CodeMirror = phosphor.components.CodeMirrorFactory;
import createFactory = phosphor.virtualdom.createFactory;

var div = DOM.div;

export interface ICellData extends IData {
  /**
   * Model data of the cell
   *
   * Data that will be synced across collaborators and that contains
   * meaning fullinformation like metadata, text and type of cell
   */
  model:CellModel;
  requestSelect:() => void
  /**
   * Is the cell currently selected
   *
   * Will affect actions, like copy pasting and of course 
   * style of the cell.
   */
  selected:boolean;
  rendered?:boolean;
}

export class CellComponent extends Component<ICellData> {

  static tagName = 'div';

  // code_cell and rendered are probably not static, and should be part of a method.
  //static className = 'cell code_cell rendered';

  constructor() {
    super();
    this.node.onclick = this.onclick.bind(this);
  }

  onclick(): void {
    this.data.requestSelect();
  }

  beforeRender(): void {
    this.node.className = 'cell code_cell rendered' 
            + (this.data.rendered ? ' rendered' : '')
            + (this.data.selected ? ' selected' : '');
  }

  render(): IElement[] {
    console.log('I, cell', this.data.model.id, ', will be rerendered');
    var input_prompt_number = this.data.model.execution_count;
    var input_number = input_prompt_number === undefined ? ' ' : String(input_prompt_number);
    var input_prompt = 'In [' + input_number + ']:';
    
    return [
      div({className: 'input'},
        div({className: 'prompt input_prompt'}, input_prompt),
        div({className: 'inner_cell'},
          div({className: 'input_area'},
            CodeMirror({key: this.data.key + '-cm', config: {mode: 'python', value:this.data.model.value}})
          )
        )
      )
    ]
  }
}

export var Cell = createFactory(CellComponent);

}
