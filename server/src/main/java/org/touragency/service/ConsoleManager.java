package org.touragency.service;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
public class ConsoleManager implements CommandLineRunner {

    @Override
    public void run(String... args) {
        Scanner scanner = new Scanner(System.in);
        while (true) {
            System.out.println("Enter command (log-level, shutdown):");
            String command = scanner.nextLine();

            if ("log-level".equalsIgnoreCase(command)) {
                System.out.println("Enter log level (INFO, DEBUG, ERROR):");
                String level = scanner.nextLine().toUpperCase();
                try {
                    LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
                    ch.qos.logback.classic.Logger rootLogger = loggerContext.getLogger("ROOT");
                    rootLogger.setLevel(Level.valueOf(level));
                    System.out.println("Log level updated to: " + level);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid log level. Please enter INFO, DEBUG, or ERROR.");
                }
            } else if ("shutdown".equalsIgnoreCase(command)) {
                System.out.println("Shutting down server...");
                System.exit(0);
            } else {
                System.out.println("Unknown command");
            }
        }
    }
}
