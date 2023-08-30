import TranslatorService from "./TranslatorService";
import { Language, isShouldTranslate } from "./language";

const translationDict: { [id: string]: (translatedText: string) => void } = {};
const service = new TranslatorService();

export default function traverseElements(element: HTMLElement, language: Language): void {
    traverseNode(element, language);
}

// traverse this node and its children, if return false then skip next children
// need unit test
function traverseNode(node: Node, language: Language): boolean {
    if (node.nodeName.toLowerCase() === 'script') { return false; }
    if (node.nodeName.toLowerCase() === 'code') { return false; }

    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue?.trim();
        if (text && isShouldTranslate(text)) {
            prepareNodeForTranslation(node);
            return true;
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (const childNode of node.childNodes) {
            const canTraverseBecauseNotTranslatedYet = !(node as HTMLElement).classList.contains('original-text-container')
            const canTraverseBecauseParentIsNotTranslatedYet = !(node.parentElement?.classList.contains('original-text-container'))
            if (canTraverseBecauseNotTranslatedYet && canTraverseBecauseParentIsNotTranslatedYet) {
                traverseNode(childNode, language)
            }
        }
    } else {
        console.log("textNode", node.nodeType);
    }
    return false;
}

var wrapperDiv: HTMLSpanElement | null = null;
var translatedSpan: HTMLSpanElement | null = null;

async function prepareNodeForTranslation(node: Node): Promise<void> {
    const id = self.crypto.randomUUID();
    translationDict[id] = (translatedText) => {
        if (!translatedSpan) {
            translatedSpan = document.createElement('span');
            translatedSpan.classList.add('translated-text');
        }
        if (!wrapperDiv) {
            wrapperDiv = document.createElement('span');
            wrapperDiv.classList.add('translation-wrapper');
            wrapperDiv.appendChild(translatedSpan);
            wrapperDiv.style.width = 'fit-content';
        }

        const parent = node.parentElement;
        if (parent) {
            parent.classList.add('original-text-container');
            parent.classList.add('original-text-value');
            let rect = parent.getBoundingClientRect();
            // console.log("node for",
            //     parent.offsetLeft,
            //     parent.offsetTop,
            //     rect,
            //     node.nodeValue,
            //     node.nodeType,
            //     node.nodeName,
            //     node.previousSibling?.nodeName,
            //     parent.nodeType,
            //     parent.nodeName
            // )
            parent.addEventListener('mouseover', () => {
                translatedSpan!.textContent = translatedText;
                let rect = parent.getBoundingClientRect();
                wrapperDiv!.style.top = rect.top + rect.height + 2 + 'px';
                wrapperDiv!.style.left = rect.left + 'px';
                wrapperDiv!.style.maxWidth = `${rect.width + 100}px`;
                wrapperDiv!.style.display = 'flex';
            });
            parent.addEventListener('mouseout', () => {
                wrapperDiv!.style.display = 'none';
            })

            //parent.insertBefore(wrapperDiv, node.nextSibling);
            // originalText.appendChild(wrapperDiv)
        }

        if (!wrapperDiv.parentElement) {
            document.body.appendChild(wrapperDiv)
        }
    };
    const translated = await translateChineseToEnglishOne(node.nodeValue || '');
    translationDict[id](translated);
}


async function translateChineseToEnglishOne(chineseText: string): Promise<string> {
    return service.translate(chineseText);
}
