package com.cipher.MoneyManagementSystem.Service.Interface;

import jakarta.mail.MessagingException;

import java.io.ByteArrayInputStream;

public interface EmailService {

    void sendVerificationEmail(String to, String subject, String body);
    void sendTransactionExcelDataSets(String to, String subject, String body, ByteArrayInputStream byteData) throws MessagingException;
}
