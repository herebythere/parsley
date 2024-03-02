use html::{html, HtmlWriter, Injection};

const template_str_0: &str = "<hello>world</hello>";
const template_str_1: &str = "<hello mygood=\"sir\">{}</hello>";
const injection_str_0: &str = "<howdy></howdy>";
const text_injection: &str = "pardner!";

#[test]
fn it_works() {
    let template1 = html(template_str_0, Vec::new());

    let finished_template = HtmlWriter::build(&template1);
}

#[test]
fn it_works_with_injections() {
    let inj = Injection::Str(text_injection);
    let template1 = html(template_str_1, Vec::from([inj]));

    let finished_template = HtmlWriter::build(&template1);
}
