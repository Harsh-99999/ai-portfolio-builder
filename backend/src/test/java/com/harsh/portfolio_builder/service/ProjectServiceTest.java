package com.harsh.portfolio_builder.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.harsh.portfolio_builder.exception.ApiException;
import com.harsh.portfolio_builder.repository.ProjectRepository;
import com.harsh.portfolio_builder.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Mock ProjectRepository projects;
    @Mock UserRepository users;

    @Test void projectLookupIsScopedToAuthenticatedOwner() {
        when(projects.findByIdAndUserEmailIgnoreCase(17L, "owner@example.com"))
                .thenReturn(Optional.empty());
        ProjectService service = new ProjectService(projects, users);

        assertThrows(ApiException.class, () -> service.get("owner@example.com", 17L));
        verify(projects).findByIdAndUserEmailIgnoreCase(17L, "owner@example.com");
    }
}
