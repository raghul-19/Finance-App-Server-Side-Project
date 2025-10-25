package com.cipher.MoneyManagementSystem.Service.Implementation;

import com.cipher.MoneyManagementSystem.Service.Interface.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.util.ByteArrayDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

@Service

public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    private final static String sender="raghul19april@gmail.com";

    @Override
    public void sendVerificationEmail(String to, String subject, String body) {
        SimpleMailMessage mailMessage=new SimpleMailMessage();
        mailMessage.setFrom(sender);
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(body);
        javaMailSender.send(mailMessage);
    }

    @Override
    public void sendTransactionExcelDataSets(String to, String subject, String body, ByteArrayInputStream byteData) throws MessagingException {
        byte[] data=byteData.readAllBytes();
        MimeMessage mimeMessage=javaMailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(mimeMessage,true);
        helper.setFrom(sender);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);
        helper.addAttachment("income_records.xlsx",new ByteArrayResource(data));
        javaMailSender.send(mimeMessage);
    }
}
