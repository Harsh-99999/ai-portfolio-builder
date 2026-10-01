package com.harsh.portfolio_builder.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.harsh.portfolio_builder.dto.ai.AiRequest;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class GeminiServiceTest {
    @Test
    void retries503WithStableFallbackModel() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        server.expect(requestTo("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent"))
                .andRespond(withStatus(HttpStatus.SERVICE_UNAVAILABLE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":{\"code\":503,\"status\":\"UNAVAILABLE\"}}"));
        server.expect(requestTo("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent"))
                .andRespond(withSuccess(
                        "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"A grounded suggestion.\"}]}}]}",
                        MediaType.APPLICATION_JSON));

        GeminiService service = new GeminiService(builder, "test-key", "gemini-3.8-flash");
        AiRequest request = new AiRequest(null, null, null, null, null, null, null, null, null,
                List.of(), List.of(), List.of(), List.of(), List.of(), null, null);

        assertEquals("A grounded suggestion.", service.generateAbout(request).suggestion());
        server.verify();
    }
}
