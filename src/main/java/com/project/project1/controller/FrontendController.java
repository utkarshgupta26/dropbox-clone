package com.project.project1.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = { "/", "/app/{path:[^\\.]*}" })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
