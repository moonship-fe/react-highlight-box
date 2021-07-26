import * as React from "react";
import {refractor} from "refractor";
import {last, omit} from "lodash";

interface Props {
    lang: string,
    source: string
}

export const clone = path => path.map((node) => ({...node}));

export const replace = (path, leaf) => [...clone(path.slice(0, -1)), leaf];

const treeToPathList = (node, output = [], path = []) => {
    const nodeToUse = omit(node, 'children');

    if (node.children) {
        path.push(nodeToUse);
        for (const child of node.children) {
            treeToPathList(child, output, path);
        }
        path.pop();
    }
    else {
        output.push(clone([...path.slice(1), nodeToUse]));
    }

    return output;
};

const splitPathToLines = path => {
    const leaf = last(path);
    if (!leaf.value.includes('\n')) {
        return [path];
    }

    const linesOfText = leaf.value.split('\n');
    return linesOfText.map(line => replace(path, {...leaf, value: line}));
};

const splitByLineBreak = paths => paths.reduce(
    (lines, path) => {
        const currentLine = last(lines);
        const [currentRemaining, ...nextLines] = splitPathToLines(path);
        return [
            ...lines.slice(0, -1),
            [...currentLine, currentRemaining],
            ...nextLines.map(path => [path]),
        ];
    },
    [[]]
);

const toTokenTree = tree => {
    const paths = treeToPathList(tree);
    const linesOfPaths = splitByLineBreak(paths);
    return linesOfPaths;
};

export const CodeHighlight: React.FC<Props> = (props) => {
    const {lang, source} = props;

    const tokenTree = toTokenTree(refractor.highlight(source, lang));

    const td = (item) => {
        return item.map(token => {
            if (token[0].type === 'text') {
                return <span>{token[0].value}</span>
            } else {
                return <span>{token[1].value}</span>
            }
        })
    }

    return (
        <div className="App">
            <table>
                <tbody>
                {
                    tokenTree.map((item, index) => {
                        return (<tr key={index}>
                            <td style={{whiteSpace: 'pre-wrap'}}>
                                {td(item)}
                            </td>
                        </tr>)
                    })
                }
                </tbody>
            </table>
        </div>
    );
}
