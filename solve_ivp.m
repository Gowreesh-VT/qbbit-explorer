% Solve the IVP: y'' + y = cos(ωt), ω² ≠ 1, y(0) = 0, y'(0) = 0
% Plot the solution for ω = 0.2, 0.9, and 6

clc
clear all
close all

% Define symbolic variables
syms t
syms y(t)
Dy = diff(y);

% Define the values of omega to test
omega_values = [0.2, 0.9, 6];
line_styles = ["-", "--", ":"];
colors = ['r', 'b', 'g'];

% Create figure for all three solutions
figure('Position', [100, 100, 1200, 800]);

for i = 1:length(omega_values)
    omega = omega_values(i);
    
    % Define the differential equation: y'' + y = cos(ωt)
    ode = diff(y, t, 2) + y == cos(omega*t);
    
    % Define initial conditions
    cond1 = y(0) == 0;
    cond2 = Dy(0) == 0;
    conds = [cond1 cond2];
    
    % Solve the ODE with initial conditions
    Sol = dsolve(ode, conds);
    Sol = simplify(Sol);
    
    % Display the solution
    fprintf('Solution for ω = %.1f:\n', omega);
    disp(Sol);
    fprintf('\n');
    
    % Plot each solution in a subplot
    subplot(3, 1, i);
    fplot(Sol, [0, 20], 'LineWidth', 2, 'Color', colors(i), 'LineStyle', line_styles(i));
    grid on;
    xlabel('Time (t)');
    ylabel('y(t)');
    title(sprintf('Solution for ω = %.1f', omega));
    ylim([-3, 3]);
    
    % Add legend with the solution
    legend(sprintf('ω = %.1f', omega), 'Location', 'best');
end

% Create a second figure to compare all solutions
figure('Position', [100, 100, 1000, 600]);
hold on;

for i = 1:length(omega_values)
    omega = omega_values(i);
    
    % Define and solve the ODE again for comparison plot
    ode = diff(y, t, 2) + y == cos(omega*t);
    cond1 = y(0) == 0;
    cond2 = Dy(0) == 0;
    conds = [cond1 cond2];
    Sol = dsolve(ode, conds);
    Sol = simplify(Sol);
    
    % Plot on the same axes
    fplot(Sol, [0, 20], 'LineWidth', 2.5, 'LineStyle', line_styles(i), 'DisplayName', sprintf('ω = %.1f', omega));
end

grid on;
xlabel('Time (t)', 'FontSize', 12);
ylabel('y(t)', 'FontSize', 12);
title('Comparison of Solutions for Different ω Values', 'FontSize', 14);
legend('Location', 'best', 'FontSize', 11);
ylim([-3, 3]);
hold off;

%% Physical Interpretation
fprintf('=== PHYSICAL INTERPRETATION ===\n\n');

fprintf('This is a forced harmonic oscillator problem where:\n');
fprintf('- The natural frequency of the system is ω₀ = 1\n');
fprintf('- The forcing frequency is ω\n\n');

fprintf('For ω = 0.2:\n');
fprintf('  - ω << ω₀ (low frequency forcing)\n');
fprintf('  - The response has small amplitude oscillations\n');
fprintf('  - The system responds smoothly to slow forcing\n');
fprintf('  - Beat phenomenon with slow modulation\n\n');

fprintf('For ω = 0.9:\n');
fprintf('  - ω ≈ ω₀ (near resonance)\n');
fprintf('  - The response shows larger amplitude oscillations\n');
fprintf('  - Clear beating pattern visible\n');
fprintf('  - As ω → 1, amplitude would grow without bound (resonance)\n\n');

fprintf('For ω = 6:\n');
fprintf('  - ω >> ω₀ (high frequency forcing)\n');
fprintf('  - The response has smaller amplitude and faster oscillations\n');
fprintf('  - The system cannot follow rapid forcing efficiently\n');
fprintf('  - Higher frequency oscillations with small amplitude\n\n');

fprintf('General Form of Solution:\n');
fprintf('y(t) = [cos(ωt) - cos(t)]/(1 - ω²) for ω² ≠ 1\n');
fprintf('This shows the superposition of the forcing term and natural response.\n');
