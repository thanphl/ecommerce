import A from "../../../../../../../../js/production/a.js";

export default function AddNewButton({ url }) {
    return React.createElement(A, { pushState: true, text: "New attribute", url: url, className: "uk-button uk-button-primary uk-button-small" });
}