import * as esprima from 'esprima';

let rows = [];

let original_code = '';

let elseif = false;

let block_types_to_funcs_dic = {
    'Program' : handle_program,
    'IfStatement' : handle_if,
    'ReturnStatement': handle_return,
    'WhileStatement' : handle_while,
    'FunctionDeclaration' : handle_func_dec,
    'ForStatement' : handle_for,
    'BlockStatement' : handle_block,
    'VariableDeclaration' : handle_var_declaration,
    'AssignmentExpression' : handle_assignment,
    'BinaryExpression' : handle_binary,
    'UnaryExpression' : handle_unary,
    'Identifier' : handle_identifier,
    'Literal' : handle_literal,
    'ExpressionStatement' : handle_expression
};


function handle_program(to_parse){
    rows = [];
    for(let i = 0; i< to_parse.body.length; i++)
        block_types_to_funcs_dic[to_parse.body[i].type](to_parse.body[i]);
    return rows;
}
function handle_if(to_parse){
    rows.push([to_parse.loc.start.line, elseif ? 'else if statement' : 'if statement', '',
        block_types_to_funcs_dic[to_parse.test.type](to_parse.test), '']);
    block_types_to_funcs_dic[to_parse.consequent.type](to_parse.consequent);
    if(to_parse.alternate == null){
        elseif = false;
    }
    else if(to_parse.alternate.type.valueOf() != 'IfStatement'.valueOf()){
        elseif = false;
        block_types_to_funcs_dic[to_parse.alternate.type](to_parse.alternate);
    }
    else{
        elseif = true;
        block_types_to_funcs_dic[to_parse.alternate.type](to_parse.alternate);
    }
    return rows;
}

function handle_return(to_parse){
    rows.push([to_parse.loc.start.line, 'return statement', '', '',block_types_to_funcs_dic[to_parse.argument.type](to_parse.argument)]);
    return rows;
}

function handle_while(to_parse){
    rows.push([to_parse.loc.start.line, 'while statement', '',
        block_types_to_funcs_dic[to_parse.test.type](to_parse.test), '']);
    return block_types_to_funcs_dic[to_parse.body.type](to_parse.body);
}


function handle_func_dec(to_parse){
    rows.push([to_parse.loc.start.line, 'function declaration', to_parse.id.name, '', '']);
    for(let i=0; i< to_parse.params.length; i++){
        rows.push([to_parse.params[i].loc.start.line,
            'variable declaration', to_parse.params[i].name,'','']);
    }
    return block_types_to_funcs_dic[to_parse.body.type](to_parse.body);
}

function handle_for(to_parse){
    rows.push([to_parse.loc.start.line, 'for statement', '',
        original_code.substring(to_parse.range[0]+4, to_parse.update.range[1]), '']);
    return block_types_to_funcs_dic[to_parse.body.type](to_parse.body);
}


function handle_block(to_parse){
    for(let i = 0; i< to_parse.body.length; i++)
        block_types_to_funcs_dic[to_parse.body[i].type](to_parse.body[i]);
    return rows;
}

function handle_var_declaration(to_parse) {
    for (let i = 0; i < to_parse.declarations.length; i++) {
        let val = to_parse.declarations[i].init == null ? 'null' : block_types_to_funcs_dic[to_parse.declarations[i].init.type](to_parse.declarations[i].init);
        rows.push([to_parse.declarations[i].id.loc.start.line,
            'variable declaration',
            to_parse.declarations[i].id.name,
            '',
            val]);
    }
    return rows;
}

function handle_assignment(to_parse){
    rows.push([to_parse.loc.start.line,
        'assignment expression',
        to_parse.left.name,
        '',
        block_types_to_funcs_dic[to_parse.right.type](to_parse.right)]);
    return rows;
}

function handle_binary(to_parse){
    return original_code.substring(to_parse.range[0], to_parse.range[1]);
}

function handle_unary(to_parse){
    if(to_parse.argument.type.valueOf() == 'Literal'.valueOf()){
        return to_parse.operator + to_parse.argument.value;
    }
    return to_parse.operator + to_parse.argument.name;
}

function handle_identifier(to_parse){
    return to_parse.name;
}

function handle_literal(to_parse){
    return to_parse.value;
}

function handle_expression(to_parse){
    block_types_to_funcs_dic[to_parse.expression.type](to_parse.expression);
}


const parseCode = (codeToParse) => {
    original_code = codeToParse;
    let parsed =  esprima.parseScript(codeToParse, {loc:true, range:true});
    let ans = block_types_to_funcs_dic[parsed.type](parsed);
    return ans;
};

export {parseCode};

