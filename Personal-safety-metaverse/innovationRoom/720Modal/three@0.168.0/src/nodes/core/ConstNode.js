import { registerNode } from './Node.js';
import InputNode from './InputNode.js';

class ConstNode extends InputNode {

	constructor( value, nodeType = null ) {

		super( value, nodeType );

		this.isConstNode = true;

	}

	generateConst( builder ) {

		return builder.generateConst( this.getNodeType( builder ), this.value );

	}

	generate( builder, output ) {

		const type = this.getNodeType( builder );

		return builder.format( this.generateConst( builder ), type, output );

	}

}

export default ConstNode;

ConstNode.type = /*@__PURE__*/ registerNode( 'Const', ConstNode );
