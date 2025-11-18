clc 
clear all 
syms x y ax ay real 
f = input('Enter the function f(x,y):');  
fx = diff(f,x); fy = diff(f,y); 
[ax, ay] = solve(fx,fy); 
ax=double(ax); ay=double(ay); r=length(ax); 
fxx = diff(fx,x);  
fxy=diff(fx,y);  
fyy=diff(fy,y); 
D = fxx*fyy – fxy^2; 
 
a1=max(ax); a2=min(ax); ex=0.5; 
b1=max(ay); b2=min(ay); ey=0.5; 
 
s=fsurf(f,[a2-ex,a1+ex,b2-ey,b1+ey],'g','EdgeColor','none' ); 
  
s.FaceAlpha = .65; 
box on     
hold on                                       
for r1=1:r 
 
  T1=subs(subs(D,x,ax(r1)),y,ay(r1)); T1=double(T1); 
  T2=subs(subs(fxx,x,ax(r1)),y,ay(r1)); T2=double(T2); 
  T3=subs(subs(f,x,ax(r1)),y,ay(r1)); T3=double(T3); 
 
    if (T1 == 0) 
        fprintf('The point (%d,%d) needs further investigation. \n', ax(r1),ay(r1)) 
    elseif (T1 < 0) 
        fprintf('The point (%d,%d) is a saddle point. \n', ax(r1),ay(r1)) 
        plot3(ax(r1),ay(r1),T3,'b.','markersize',30);
 
    else 
        if (T2 < 0) 
            fprintf('(%d, %d) is a point of maxima. \n', ax(r1),ay(r1)) 
            fprintf('The value of the function at the point of maxima is %d. \n', T3) 
            plot3(ax(r1),ay(r1),T3,'r.','markersize',30); 
        else 
            fprintf('(%d, %d) is a point of minima. \n', ax(r1),ay(r1)) 
            fprintf('The value of the function at the point of minima is %d. \n', T3) 
            plot3(ax(r1),ay(r1),T3,'k.','markersize',30); 
        end 
    end 
End









clc               
clear all        
syms x y lam real   
f = input('Enter f(x,y) to be extremized : ');  
g = input('Enter the constraint function g(x,y):’);     
  
    
F = f+ lam*g 
Fd = jacobian(F,[x y lam]) 
  
[ax, ay, alam] = solve(Fd, x, y, lam); 
ax = double(ax); 
ay = double(ay); 
  
  
T = subs(f,{x,y},{ax,ay}); 
T = double(T); 
epxl = min(ax);   
epxr = max(ax); 
epyl = min(ay);   
epyr = max(ay); 
D = [epxl-1.5 epxr+1.5 epyl-1.5 epyr+1.5] 
fcontour(f, D, 'LevelList', -12:1:12) 
axis equal 
hold on 
  h = fimplicit(g);  
set(h,'Color',[1,0.7,0.9]) 
  
    for i = 1:length(T) 
    fprintf('The function f(x,y) takes on its extreme value on the g(x,y) at  (%1.3f,%1.3f).', ax(i), ay(i))  
    fprintf('The value of the function is %1.3f\n', T(i))  
    plot3(ax(i), ay(i), T(i), 'k.', 'markersize', 15)  
end 
  
 
                                                                                                                                                                                                                                                                                              
 
 
 
 
 










clc
clear
syms t x y z 
F=input('Enter the  f vector as i and j order in vector form:');
rbar = input('Enter the r vector as i and j order in vector form:');
lim=input('Enter the limit of integration:');
vecfi=input('Enter the vector field range'); % depends on problem
drbar=diff(rbar,t);
sub = subs(F,[x,y,z],rbar);
f1=dot(sub,drbar)
int(f1,t,lim(1),lim(2))
P = inline(vectorize(F(1)), 'x', 'y','z');
Q = inline(vectorize(F(2)), 'x', 'y','z');
R = inline(vectorize(F(3)), 'x', 'y','z');
x = linspace(vecfi(1),vecfi(2), 7); y = x; 
z=x; 
[X,Y,Z] = meshgrid(x,y,z);
U = P(X,Y,Z);
V = Q(X,Y,Z);
W = R(X,Y,Z);
quiver3(X,Y,Z,U,V,W,1.5)
hold on
fplot3(rbar(1),rbar(2), rbar(3),[lim(1),lim(2)])
axis on













clc
clear all
syms x t k X(x) T(t) C1
u=X(x)*T(t);
ux=diff(u,x); ut=diff(u,t); 
pde=3*ux+2*ut;
pde1=expand(pde/u);  
deX=subs(pde1==k,diff(T(t), t),0);
cpde1=subs(pde1,{diff(X(x), x),diff(T(t), t)},{0,0});
deT=subs(pde1-cpde1==-k,diff(X(x), x),0);
X(x)=dsolve(deX); X(x)=subs(X(x),'C1',1);
T(t)=dsolve(deT);
ic1=X(x)==exp(-x);
ic2=T(0)==4;
[k,C1]=solve(ic1,ic2,[k,C1]);
u=subs(X(x)*T(t));
fprintf('\nSolution by separation of variables method is\n')
fprintf('\nu(x,t) = %s\n',u)
fsurf(u,[0 1  0  1])
xlabel('x');ylabel('y');zlabel('u');
% Verification
pde=3*ux+2*ut;
uxs=diff(u,x)
uts=diff(u,t)
v=subs(pde,[ux ut],[uxs uts])

