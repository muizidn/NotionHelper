import { Language } from "./language";
import traverseElements from "./traverseElements";

export default function translateBody(language: Language) {
    traverseElements(document.body, language);
}