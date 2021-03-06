import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className = 'square'  style = {props.style} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function SquareResX(props) {
  return (       
    <th> {props.value} </th>
    )
}

function SquareResO(props) {
  return (       
    <th> {props.value} </th>
    )
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]} // gives a number for the cell 
        style = {this.props.style[i]}
        onClick={() => this.props.onClick(i)}
        
      />
    )}

     renderSquareResX(i){
      return(
      <SquareResX value = {this.props.resultTable[i]}  /> // it goes to square the same as the value
      )
    }

    renderSquareResO(i){
      return(
      <SquareResO value = {this.props.resultTable[i]}  />
      )
    }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        <table className="tableWithResults">
        <tr>
            <th> X </th>
            <th> O </th>
        </tr>
        <tr>
        {this.renderSquareResX(0)}
        {this.renderSquareResO(1)}
        </tr>
        <tr>
        {this.renderSquareResX(2)}
        {this.renderSquareResO(3)}
        </tr>
        <tr>
        {this.renderSquareResX(4)}
        {this.renderSquareResO(5)}
        </tr>
        <tr>
        {this.renderSquareResX(6)}
        {this.renderSquareResO(7)}
        </tr>
        <tr>
        {this.renderSquareResX(8)}
        {this.renderSquareResO(9)}
        </tr>
        </table>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      xIsNext: true,
      stepNumber: 0,
      resultTable: Array(0),
      cellColors: Array(9).fill(null),
      arrForWinner:null,
    };
  }
  
  handleClick(i) { 
   
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // an Array with objects
    const current = history[history.length - 1];
    const squares = current.squares.slice();  // the last array 
    const cellColors = this.state.cellColors.slice();
    
    let resultTableChanges = this.state.resultTable.slice();
    resultTableChanges.push(i);

    if(calculateWinner(squares) || squares[i]) { 
    return
      }

    squares[i] = this.state.xIsNext ? 'X' : "O";
    let color = (squares[i] === 'X') ? {'background':'#ff6666'}: {'background':'#809fff'};
    
    cellColors.splice(i, 1, color );

    this.setState({
      history: history.concat([  // add additional obj with array
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      resultTable: resultTableChanges,
      cellColors: cellColors,  // add the color for the specific cell,
    });
    if(calculateWinner(squares)){this.changeStateForWinner(squares)}
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  changeStateForWinner(squares){
    const colorForWinner = {'background' :'yellow'};
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // an Array with objects
    const squares2 = squares.slice();  // the last array 
    let cellColors = this.state.cellColors.slice();
  
      let arr = addWinnerSquaresToArr(squares2); // number of cells for winner

      console.log(arr)
      for(let j=0; j<arr.length; j++){
        cellColors.splice(arr[j], 1, colorForWinner)
      }
      
      console.log(cellColors)

      this.setState({
        cellColors:cellColors,
      })
      console.log(this.state.cellColors)
  };

   render() {   
    const history = this.state.history;
    const current = history[this.state.stepNumber]
    let winner = calculateWinner(current.squares) 

    const moves = history.map((step, move) => {
    const desc = move ? 'Go to move #' + move : 'Go to start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}> {desc} </button>
        </li>
      )
    });

    let status;

    if (winner) {
      status = 'Winner: ' + winner; 
       
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} style = {this.state.cellColors}  resultTable = {this.state.resultTable} onClick={i => this.handleClick(i)}  />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
};

function calculateWinner(squares) {
  
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
  
           return squares[a];
    }
  }
  return null;
}

function addWinnerSquaresToArr (squares){

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let arr = [];

for (let i = 0; i < lines.length; i++) {
  const [a, b, c] = lines[i];

  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

    arr.push(a,b,c);
   
    return arr;
  }
}
return null;

}



ReactDOM.render(
  <Game />,
  document.getElementById('root')
)

// ========================================


