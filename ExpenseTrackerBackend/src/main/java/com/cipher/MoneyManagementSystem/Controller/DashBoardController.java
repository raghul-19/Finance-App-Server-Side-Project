package com.cipher.MoneyManagementSystem.Controller;

import com.cipher.MoneyManagementSystem.Service.Interface.DashBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")

public class DashBoardController {

    @Autowired
    private DashBoardService dashBoardService;

    @GetMapping
    public Map<String,Object> getDashBoardData(@RequestParam String email) {
        return dashBoardService.getDashBoardData(email);
    }
}
