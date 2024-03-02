use html::{html, HtmlWriter};

const template_str_0: &str = "<hello>world</hello>";
const template_str_1: &str = "<hello>{}</hello>";

const text_injection: &str = "";


#[test]
fn it_works() {
		let template1 = html(template_str_0, Vec::new());
		
		let finished_template = HtmlWriter::build(&template1);
}

#[test]
fn it_works_with_injections() {
		let template1 = html(template_str_1, Vec::new());
		
		let finished_template = HtmlWriter::build(&template1);
}

