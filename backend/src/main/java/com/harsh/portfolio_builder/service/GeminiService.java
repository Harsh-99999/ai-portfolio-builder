package com.harsh.portfolio_builder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.harsh.portfolio_builder.dto.ai.*;
import com.harsh.portfolio_builder.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GeminiService {
    private static final String FALLBACK_MODEL = "gemini-3.7-flash";
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    private final RestClient client; private final String apiKey; private final String model;
    public GeminiService(RestClient.Builder builder,@Value("${app.gemini.api-key:}") String apiKey,
                         @Value("${app.gemini.model}") String model) {
        this.client=builder.baseUrl("https://generativelanguage.googleapis.com").build(); this.apiKey=apiKey; this.model=model;
    }
    public AiSuggestionResponse generateAbout(AiRequest r) { return generate("Write a professional portfolio about section using only supplied facts. Do not invent employers, credentials, technologies, years, achievements, or metrics. If details are sparse, keep it grounded. Tone: "+value(r.tone(),"warm and professional")+". Length: "+value(r.length(),"medium")+". Facts: "+facts(r)); }
    public AiSuggestionResponse improveText(AiRequest r) { return generate("Improve the writing below for a professional portfolio. Preserve its exact factual meaning. Do not add claims, numbers, skills, or outcomes. Return only the suggested revision.\nText: "+value(r.text(),"")); }
    public AiSuggestionResponse projectDescription(AiRequest r) { return generate("Write a concise project description for a portfolio using only these facts. Do not infer impact or features not stated. Project: "+value(r.projectName(),"")+". Summary: "+value(r.shortDescription(),"")+". Technologies: "+value(r.technologies(),"")+". Repository details: "+value(r.repositoryInfo(),"")); }
    public AiSuggestionResponse experienceDescription(AiRequest r) { return generate("Improve this role description for a portfolio. Describe responsibilities based only on supplied facts. Never invent achievements or metrics; if there are none, don't imply them. Company: "+value(r.company(),"")+". Role: "+value(r.role(),"")+". Existing description: "+value(r.text(),"")); }
    public AiSuggestionResponse professionalSummary(AiRequest r) { return generate("Write a concise professional summary based only on supplied facts. Do not invent years of experience, achievements, credentials, or skills. Facts: "+facts(r)); }
    private AiSuggestionResponse generate(String prompt) {
        if(apiKey==null||apiKey.isBlank()) throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,"AI_NOT_CONFIGURED","AI suggestions need a Gemini API key in the backend environment");
        try {
            return requestSuggestion(prompt, model);
        } catch(ApiException exception) { throw exception; }
        catch(RestClientResponseException exception) {
            if (exception.getStatusCode().value() == 503 && !FALLBACK_MODEL.equals(model)) {
                logger.warn("Gemini model {} returned 503; retrying with fallback model {}", model, FALLBACK_MODEL);
                try {
                    return requestSuggestion(prompt, FALLBACK_MODEL);
                } catch (ApiException fallbackException) {
                    throw fallbackException;
                } catch (RestClientResponseException fallbackException) {
                    throw upstreamError(fallbackException);
                } catch (RestClientException fallbackException) {
                    logger.warn("Gemini fallback request failed before an HTTP response ({})", fallbackException.getClass().getSimpleName());
                    throw new ApiException(HttpStatus.BAD_GATEWAY, "AI_UNAVAILABLE", "Gemini is temporarily unavailable; please try again shortly");
                }
            }
            throw upstreamError(exception);
        }
        catch(RestClientException exception) {
            logger.warn("Gemini request failed before an HTTP response ({})", exception.getClass().getSimpleName());
            throw new ApiException(HttpStatus.BAD_GATEWAY,"AI_UNAVAILABLE","AI suggestions are temporarily unavailable");
        }
    }
    private AiSuggestionResponse requestSuggestion(String prompt, String selectedModel) {
        JsonNode response=client.post().uri("/v1beta/models/{model}:generateContent",selectedModel).header("x-goog-api-key",apiKey)
                .body(java.util.Map.of("contents",java.util.List.of(java.util.Map.of("parts",java.util.List.of(java.util.Map.of("text",prompt))))))
                .retrieve().body(JsonNode.class);
        String text=response==null?null:response.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText(null);
        if(text==null||text.isBlank()) throw new ApiException(HttpStatus.BAD_GATEWAY,"AI_EMPTY_RESPONSE","AI could not create a suggestion right now");
        return new AiSuggestionResponse(text.trim());
    }
    private ApiException upstreamError(RestClientResponseException exception) {
        int status = exception.getStatusCode().value();
        String providerError = exception.getResponseBodyAsString();
        if (apiKey != null && !apiKey.isBlank()) providerError = providerError.replace(apiKey, "[redacted]");
        logger.warn("Gemini API returned HTTP {}: {}", status, providerError);
        String message = switch (status) {
            case 401, 403 -> "Gemini rejected the configured API key or its permissions";
            case 404 -> "The configured Gemini model or API endpoint was not found";
            case 429 -> "Gemini quota or rate limit was reached";
            case 503 -> "Gemini models are temporarily overloaded; please try again shortly";
            default -> "Gemini returned HTTP " + status + " while creating a suggestion";
        };
        return new ApiException(HttpStatus.BAD_GATEWAY, "AI_UPSTREAM_ERROR", message);
    }
    private String facts(AiRequest r) { return "name="+value(r.name(),"")+", headline="+value(r.headline(),"")+", bio="+value(r.bio(),"")+", skills="+value(r.skills(),"")+", experience="+value(r.experience(),"")+", education="+value(r.education(),"")+", projects="+value(r.projects(),""); }
    private String value(Object value,String fallback){return value==null?fallback:value.toString();}
}
