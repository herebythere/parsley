use html::{html, HtmlWriter, Injection};

const template_str_0: &str = "<hello>world</hello>";
const template_str_1: &str = "<hello mygood=\"sir\">{}</hello>";
const injection_template_0: &str = "<howdy>{}</howdy>";
const text_injection: &str = "pardner!";

#[test]
fn it_works() {
    let template1 = html(template_str_0, Vec::new());

    let finished_template = HtmlWriter::build(&template1);
}

#[test]
fn it_works_with_str_injections() {
    let inj = Injection::Str(text_injection);
    let template1 = html("<hello mygood=\"sir\">{}</hello>", Vec::from([inj]));

    let finished_template = HtmlWriter::build(&template1);
}

#[test]
fn it_works_with_template_injections() {
    let inj = Injection::Str(text_injection);
    let template = html(injection_template_0, Vec::from([inj]));

    let temp_inj = Injection::Template(template);
    let template1 = html("<hello mygood=\"sir\">{}</hello>", Vec::from([temp_inj]));

    let finished_template = HtmlWriter::build(&template1);
}
