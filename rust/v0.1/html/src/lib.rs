// start with string, load file next

// go over with iterator

// output to file

// keep track of tabs
// remove whitespace cruft
// outputing 

// "<hello>{}</hello>", world

// 
use std::collections::HashMap;
use parsley::parse::StringIterator;
use parsley::type_flyweight::Results;

pub enum Injection<'a> {
	String,
	VecString(Vec<String>),
	Template(Template<'a>),
}

pub struct Template<'a> {
	template: &'a str,
	injections: Vec<Injection<'a>>
}

pub struct StackBit<'a> {
	template: Template<'a>,
	iterator: StringIterator<'a>,
	inj_index: usize,
}

pub struct HtmlWriter<'a> {
	html_result: String,
	builds: HashMap<String, Results>,
	tab_count: usize,
	stack: Vec<StackBit<'a>>,
}

impl HtmlWriter<'_> {
	pub fn write(template: &Template) {
		// can cache here
	}
}

// standalone
pub fn html<'a>(template: &'a str, injections: Vec<Injection<'a>>) -> Template<'a> {
	Template {
		template: template,
		injections: injections,
	}
}

pub fn add(left: usize, right: usize) -> usize {
    left + right
}



